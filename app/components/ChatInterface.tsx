"use client";
import { RunStatus } from "openai/resources/beta/threads/index.mjs";
import { TextContentBlock } from "openai/resources/beta/threads/messages.mjs";
import React, { useEffect, useState } from "react";
import { AssistantType, FileObjectType, MessageType, ThreadType } from "../constants/type";
import client from "../lib/client";

const ChatInterface = () => {
  const [assistants, setAssistants] = useState<AssistantType[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState<AssistantType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [files, setFiles] = useState<FileObjectType[]>([]);
  const [thread, setThread] = useState<ThreadType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    createInitialAssistant();
    createNewThread();
  }, []);

  const createInitialAssistant = async () => {
    try {
      const res = await client.api.hono.assistants.create_assistant.$post({
        json: { name: "Default Assistant", description: "", instructions: "" },
      });
      const newAssistant = await res.json();
      setAssistants([newAssistant]);
      setSelectedAssistant(newAssistant);
    } catch (error) {
      setError("Failed to create initial assistant");
    }
  };

  const createNewThread = async () => {
    try {
      const res = await client.api.hono.assistants.create_thread.$post({
        json: {},
      });
      const thread = await res.json();
      setThread(thread);
    } catch (error) {
      setError("Failed to create a new thread");
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !thread || !selectedAssistant) return;

    setIsLoading(true);
    setError(null);

    try {
      const resMes = await client.api.hono.assistants.add_message.$post({
        json: { threadId: thread.id, content: inputMessage, fileIds: files.map((file) => file.id) },
      });
      const newMessage = await resMes.json();
      setMessages([...messages, newMessage]);
      setInputMessage("");
      setFiles([]);

      const resRun = await client.api.hono.assistants.run_assistant.$post({
        json: { threadId: thread.id, assistantId: selectedAssistant.id },
      });
      const run = await resRun.json();
      await pollRunStatus(thread.id, run.id);

      const resMesList = await client.api.hono.assistants.messages[":threadId"].$get({
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
      const resRun = await client.api.hono.assistants.get_run_status.$post({
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
      const res = await client.api.hono.assistants.upload_file.$post({
        form: { file },
      });
      const uploadedFile = await res.json();
      setFiles([...files, uploadedFile]);
    } catch (error) {
      setError("Failed to upload file");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAssistant = async () => {
    const name = prompt("Enter assistant name:");
    const description = prompt("Enter assistant description:");
    const instructions = prompt("Enter assistant instructions:");
    if (name && description && instructions) {
      try {
        const res = await client.api.hono.assistants.create_assistant.$post({
          json: { name, description, instructions },
        });
        const newAssistant = await res.json();
        setAssistants([...assistants, newAssistant]);
        setSelectedAssistant(newAssistant);
      } catch (error) {
        setError("Failed to create new assistant");
      }
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
            {message.attachments?.map((attachment) => `${attachment.file_id}¥n`)}
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
          disabled={isLoading}
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          Send
        </button>
        <input type="file" onChange={handleFileUpload} disabled={isLoading} />{" "}
        {/* なんかEdgeだと反応しない場合がある？ */}
      </div>
      {isLoading && <div className="loading">Loading...</div>}
    </div>
  );
};

export default ChatInterface;
