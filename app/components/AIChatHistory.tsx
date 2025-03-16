import { useEffect, useState } from "react";
import client from "../lib/client";
import { supabase } from "../lib/supabase";

type ChatSession = {
  id: number;
  created_at: string;
  openai_assistant_id: string;
  openai_thread_id: string;
  assistant_name: string;
  first_message: string;
};

function AIChatHistory() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    fetchChatSessions();
  }, []);

  const fetchChatSessions = async () => {
    try {
      const { data, error } = await supabase
        .from("openai_assistant_sessions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const sessionsWithDetails = await Promise.all(
        data.map(async (session) => {
          const assistant = await fetchAssistantDetails(session.openai_assistant_id);
          const firstMessage = await fetchFirstMessage(session.openai_thread_id);
          return {
            ...session,
            assistant_name: assistant?.name || "Unknown Assistant",
            first_message: firstMessage || "No messages",
          };
        }),
      );

      setChatSessions(sessionsWithDetails);
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
    }
  };

  const fetchAssistantDetails = async (assistantId: string) => {
    try {
      const res = await client.api.main.assistants.retrieve_assistant[":assistantId"].$get({
        param: { assistantId },
      });
      return await res.json();
    } catch (error) {
      console.error("Error fetching assistant details:", error);
      return null;
    }
  };

  const fetchFirstMessage = async (threadId: string) => {
    try {
      const res = await client.api.main.assistants.first_message[":threadId"].$get({
        param: { threadId },
      });
      const message = await res.json();
      return message.content[0] && "text" in message.content[0]
        ? message.content[0].text.value || ""
        : "";
    } catch (error) {
      console.error("Error fetching first message:", error);
      return "";
    }
  };

  return (
    <div className="h-screen w-64 overflow-y-auto bg-gray-100 p-4">
      <h2 className="mb-4 text-xl font-bold">Chat History</h2>
      <ul>
        {chatSessions.map((session) => (
          <li key={session.id} className="mb-4 rounded bg-white p-2 shadow">
            <p className="font-semibold">{session.assistant_name}</p>
            <p className="truncate text-sm text-gray-600">{session.first_message}</p>
            <p className="text-xs text-gray-400">{new Date(session.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AIChatHistory;
