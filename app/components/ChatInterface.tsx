"use client";
import { RunStatus } from "openai/resources/beta/threads/index.mjs";
import { TextContentBlock } from "openai/resources/beta/threads/messages.mjs";
import React, { useCallback, useEffect, useState } from "react";
import { AssistantType, FileObjectType, MessageType, ThreadType } from "../constants/type";
import client from "../lib/client";
import { supabase } from "../lib/supabase";

export default function ChatInterface() {
  const [assistants, setAssistants] = useState<AssistantType[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState<AssistantType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [filesToUpload, setFilesToUpload] = useState<FileObjectType[]>([]);
  const [threadFiles, setThreadFiles] = useState<FileObjectType[]>([]);
  const [thread, setThread] = useState<ThreadType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAssistant = async (name: string, description: string, instructions: string) => {
    setIsLoading(true);

    try {
      const res = await client.api.main.assistants.create_assistant.$post({
        json: { name, description, instructions },
      });
      const newAssistant = await res.json();
      setAssistants((prevAssistants) => [...prevAssistants, newAssistant]);
      setSelectedAssistant(newAssistant);
    } catch (error) {
      setError("Failed to create initial assistant");
    } finally {
      setIsLoading(false);
    }
  };

  const createNewThread = useCallback(async () => {
    if (!selectedAssistant) return;
    setIsLoading(true);

    try {
      const res = await client.api.main.assistants.create_thread.$post({
        json: {},
      });
      const thread = await res.json();
      setThread(thread);
      setMessages([]);
      await createSessionInDatabase(selectedAssistant.id, thread.id);
    } catch (error) {
      setError("Failed to create a new thread");
    } finally {
      setIsLoading(false);
    }
  }, [selectedAssistant]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !thread || !selectedAssistant) return;

    setIsLoading(true);
    setError(null);

    try {
      const resMes = await client.api.main.assistants.add_message.$post({
        json: { threadId: thread.id, content: inputMessage, files: filesToUpload },
      });
      const newMessage = await resMes.json();
      setMessages([...messages, newMessage]);
      setInputMessage("");
      setFilesToUpload([]);

      const resRun = await client.api.main.assistants.run_assistant.$post({
        json: { threadId: thread.id, assistantId: selectedAssistant.id },
      });
      const run = await resRun.json();
      await pollRunStatus(thread.id, run.id);

      const resMesList = await client.api.main.assistants.messages[":threadId"].$get({
        param: { threadId: thread.id },
      });
      const threadMessages = await resMesList.json();
      setMessages(threadMessages.reverse());
    } catch (error) {
      setError("Failed to send message or get response");
    } finally {
      setIsLoading(false);
    }
  };

  const pollRunStatus = async (threadId: string, runId: string) => {
    let status: RunStatus = "queued";
    while (status !== "completed") {
      const resRun = await client.api.main.assistants.get_run_status.$post({
        json: { threadId, runId },
      });
      const run = await resRun.json();
      status = run.status;
      if (
        status === "failed" ||
        status === "expired" ||
        status === "cancelled" ||
        status === "incomplete"
      ) {
        throw new Error(`Run ended with status: ${status}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await client.api.main.assistants.upload_file.$post({
        form: { file },
      });
      const uploadedFile = await res.json();
      setFilesToUpload([...filesToUpload, uploadedFile]);
    } catch (error) {
      setError("Failed to upload file");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAssistant = async () => {
    const name = prompt("Enter assistant name:");
    const description = prompt("Enter assistant description:") ?? "";
    const instructions = prompt("Enter assistant instructions:") ?? "";
    if (name) {
      try {
        await createAssistant(name, description, instructions);
      } catch (error) {
        setError("Failed to create new assistant");
      }
    }
  };

  // createNewThread will be called automatically when selectedAssistant is changed
  useEffect(() => {
    if (selectedAssistant) {
      createNewThread();
    }
  }, [selectedAssistant, createNewThread]);

  // retrieve files for the current thread
  useEffect(() => {
    const retrieveNewFiles = async () => {
      const newFileIds = messages.flatMap(
        (message) =>
          message.attachments
            ?.map((attachment) => attachment.file_id)
            .filter((id) => id !== undefined) || [],
      );

      const uniqueNewFileIds = Array.from(new Set(newFileIds));
      const fileIdsToRetrieve = uniqueNewFileIds.filter(
        (fileId) => !threadFiles.some((file) => file.id === fileId),
      );

      const newFiles = await Promise.all(
        fileIdsToRetrieve.map(async (fileId) => {
          try {
            const res = await client.api.main.assistants.retrieve_file[":fileId"].$get({
              param: { fileId },
            });
            return await res.json();
          } catch (error) {
            console.error(`Failed to retrieve file ${fileId}:`, error);
            return null;
          }
        }),
      );

      const validNewFiles = newFiles.filter((file) => file !== null);
      setThreadFiles((prevFiles) => [...prevFiles, ...validNewFiles]);
    };

    retrieveNewFiles();
  }, [messages]);

  const createSessionInDatabase = async (assistantId: string, threadId: string) => {
    try {
      const { data, error } = await supabase.from("openai_assistant_sessions").upsert(
        { openai_assistant_id: assistantId, openai_thread_id: threadId },
        {
          onConflict: "openai_thread_id",
        },
      );

      if (error) throw error;
      console.log("Session created or updated:", data);
    } catch (error) {
      console.error("Error creating/updating session in database:", error);
      setError("Failed to create/update session in database");
    }
  };

  return (
    <div className="chat-interface">
      <div className="assistant-selection">
        <select
          value={selectedAssistant?.id || ""}
          onChange={(e) =>
            setSelectedAssistant(assistants.find((a) => a.id === e.target.value) || null)
          }
        >
          {assistants.map((assistant) => (
            <option key={assistant.id} value={assistant.id}>
              {assistant.name}
            </option>
          ))}
        </select>
        <button onClick={handleCreateAssistant}>Create New Assistant</button>
      </div>
      <div className="message-list">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.attachments?.map((attachment) => {
              const file = threadFiles.find((f) => f.id === attachment.file_id);
              return file ? `📂${file.filename}\n` : `unknown file id: ${attachment.file_id}\n`;
            })}
            {(message.content[0] as TextContentBlock).text.value}
          </div>
        ))}
      </div>
      {error && <div className="error">{error}</div>}
      <div className="input-area">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading || !selectedAssistant}
        />
        <button onClick={handleSendMessage} disabled={isLoading || !selectedAssistant}>
          Send
        </button>
        <input type="file" onChange={handleFileUpload} disabled={isLoading || !selectedAssistant} />{" "}
        {/* なんかEdgeだと反応しない場合がある？ */}
      </div>
      {isLoading && <div className="loading">Loading...</div>}
    </div>
  );
}
