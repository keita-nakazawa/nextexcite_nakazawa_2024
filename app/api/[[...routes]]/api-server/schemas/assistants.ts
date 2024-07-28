import { z } from "zod";
import { zfd } from "zod-form-data";

export const createAssistantSchema = z.object({
  name: z.string(),
  description: z.string(),
  instructions: z.string(),
  model: z.string().default("gpt-4o-mini"),
});

export const createThreadSchema = z.object({});

export const addMessageSchema = z.object({
  threadId: z.string(),
  content: z.string(),
  fileIds: z.array(z.string()).optional(),
});

export const runAssistantSchema = z.object({
  assistantId: z.string(),
  threadId: z.string(),
});

export const getRunStatusSchema = z.object({
  threadId: z.string(),
  runId: z.string(),
});

export const getMessagesSchema = z.object({
  threadId: z.string(),
});

export const uploadFileSchema = z.object({
  file: zfd.file(),
});
