import { OpenAITools } from "@/app/constants/const";
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const createAssistant = async (
  name: string,
  description: string,
  instructions: string,
  model: string,
) => {
  return await openai.beta.assistants.create({
    name,
    description,
    instructions,
    model,
    tools: [{ type: OpenAITools.CODE_INTERPRETER }, { type: OpenAITools.FILE_SEARCH }],
  });
};

export const createThread = async () => {
  return await openai.beta.threads.create();
};

export const addMessage = async (threadId: string, content: string, fileIds: string[] = []) => {
  return await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content,
    attachments:
      fileIds.length > 0
        ? fileIds.map((id) => ({
            file_id: id,
            tools: [{ type: OpenAITools.CODE_INTERPRETER }, { type: OpenAITools.FILE_SEARCH }],
          }))
        : [],
  });
};

export const runAssistant = async (assistantId: string, threadId: string) => {
  return await openai.beta.threads.runs.create(threadId, { assistant_id: assistantId });
};

export const getRunStatus = async (threadId: string, runId: string) => {
  return await openai.beta.threads.runs.retrieve(threadId, runId);
};

export const getMessages = async (threadId: string) => {
  const response = await openai.beta.threads.messages.list(threadId);
  return response.data;
};

export const uploadFile = async (file: File) => {
  return await openai.files.create({ file, purpose: "assistants" });
};
