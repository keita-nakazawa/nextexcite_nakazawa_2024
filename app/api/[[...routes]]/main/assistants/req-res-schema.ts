import { FileObjectType } from "@/app/constants/type";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const createAssistantReqSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    instructions: z.string(),
    model: z.string().default("gpt-4o-mini"),
  })
  .brand("CreateAssistantReqSchema");

export const retrieveAssistantReqSchema = z
  .object({
    assistantId: z.string(),
  })
  .brand("RetrieveAssistantReqSchema");

export const addMessageReqSchema = z
  .object({
    threadId: z.string(),
    content: z.string(),
    files: z.array(z.custom<FileObjectType>()).optional(),
  })
  .brand("AddMessageReqSchema");

export const runAssistantReqSchema = z
  .object({
    assistantId: z.string(),
    threadId: z.string(),
  })
  .brand("RunAssistantReqSchema");

export const getRunStatusReqSchema = z
  .object({
    threadId: z.string(),
    runId: z.string(),
  })
  .brand("GetRunStatusReqSchema");

export const getMessagesReqSchema = z
  .object({
    threadId: z.string(),
  })
  .brand("GetMessagesReqSchema");

export const getFirstMessageReqSchema = z
  .object({
    threadId: z.string(),
  })
  .brand("GetFirstMessageReqSchema");

export const uploadFileReqSchema = z
  .object({
    file: zfd.file(),
  })
  .brand("UploadFileReqSchema");

export const retrieveFileReqSchema = z
  .object({
    fileId: z.string(),
  })
  .brand("RetrieveFileReqSchema");
