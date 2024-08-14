import { z } from "zod";
import { zfd } from "zod-form-data";

export const createAssistantReqSchema = z.object({
  name: z.string(),
  description: z.string(),
  instructions: z.string(),
  model: z.string().default("gpt-4o-mini"),
});

export const addMessageReqSchema = z.object({
  threadId: z.string(),
  content: z.string(),
  fileIds: z.array(z.string()).optional(),
});

export const runAssistantReqSchema = z.object({
  assistantId: z.string(),
  threadId: z.string(),
});

export const getRunStatusReqSchema = z.object({
  threadId: z.string(),
  runId: z.string(),
});

export const getMessagesReqSchema = z.object({
  threadId: z.string(),
});

export const uploadFileReqSchema = z.object({
  file: zfd.file(),
});
