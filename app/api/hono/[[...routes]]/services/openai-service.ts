import {
  CodeInterpreterExtensions,
  FileSearchExtensions,
  OpenAITools,
} from "@/app/constants/const";
import { FileObjectType } from "@/app/constants/type";
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

export const retrieveAssistant = async (assistantId: string) => {
  return await openai.beta.assistants.retrieve(assistantId);
};

export const createThread = async () => {
  return await openai.beta.threads.create();
};

export const addMessage = async (
  threadId: string,
  content: string,
  files: FileObjectType[] = [],
) => {
  const attachments = files.map((file) => {
    const extension = file.filename.split(".").pop()?.toLowerCase();
    const tools = [];
    if (CodeInterpreterExtensions.includes(extension ?? "")) {
      tools.push({ type: OpenAITools.CODE_INTERPRETER });
    }
    if (FileSearchExtensions.includes(extension ?? "")) {
      tools.push({ type: OpenAITools.FILE_SEARCH });
    }
    if (tools.length === 0) {
      throw new Error("Unsupported file type for attachment");
    }
    return {
      file_id: file.id,
      tools,
    };
  });

  return await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content,
    attachments: files.length > 0 ? attachments : [],
  });
};

export const runAssistant = async (assistantId: string, threadId: string) => {
  return await openai.beta.threads.runs.create(threadId, { assistant_id: assistantId });
};

export const getRunStatus = async (threadId: string, runId: string) => {
  return await openai.beta.threads.runs.retrieve(threadId, runId);
};

export const getMessages = async (threadId: string) => {
  const response = await openai.beta.threads.messages.list(threadId, { limit: 100 });
  return response.data;
};

export const getFirstMessage = async (threadId: string) => {
  const response = await openai.beta.threads.messages.list(threadId, { limit: 1, order: "asc" });
  return response.data;
};

export const uploadAssistantsFile = async (file: File) => {
  return await openai.files.create({ file, purpose: "assistants" });
};

export const uploadVisionFile = async (file: File) => {
  return await openai.files.create({ file, purpose: "vision" });
};

export const retrieveFile = async (fileId: string) => {
  return await openai.files.retrieve(fileId);
};
