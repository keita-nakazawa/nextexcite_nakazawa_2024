import {
  AssistantType,
  FileObjectType,
  MessageType,
  RunType,
  ThreadType,
} from "@/app/constants/type";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createFactory } from "hono/factory";
import * as schemas from "../schemas/assistants";
import * as openaiService from "../services/openai-service";

const factory = createFactory();

const createAssistant = factory.createHandlers(
  zValidator("json", schemas.createAssistantReqSchema),
  async (c) => {
    const { name, description, instructions, model } = c.req.valid("json");
    const assistant = await openaiService.createAssistant(name, description, instructions, model);
    const response = assistant as AssistantType;
    return c.json(response);
  },
);

const createThread = factory.createHandlers(async (c) => {
  const thread = await openaiService.createThread();
  const response = thread as ThreadType;
  return c.json(response);
});

const addMessage = factory.createHandlers(
  zValidator("json", schemas.addMessageReqSchema),
  async (c) => {
    const { threadId, content, fileIds } = c.req.valid("json");
    const message = await openaiService.addMessage(threadId, content, fileIds);
    const response = message as MessageType;
    return c.json(response);
  },
);

const runAssistant = factory.createHandlers(
  zValidator("json", schemas.runAssistantReqSchema),
  async (c) => {
    const { assistantId, threadId } = c.req.valid("json");
    const run = await openaiService.runAssistant(assistantId, threadId);
    const response = run as RunType;
    return c.json(response);
  },
);

const getRunStatus = factory.createHandlers(
  zValidator("json", schemas.getRunStatusReqSchema),
  async (c) => {
    const { threadId, runId } = c.req.valid("json");
    const run = await openaiService.getRunStatus(threadId, runId);
    const response = run as RunType;
    return c.json(response);
  },
);

const getMessages = factory.createHandlers(
  zValidator("param", schemas.getMessagesReqSchema),
  async (c) => {
    const { threadId } = c.req.valid("param");
    const messages = await openaiService.getMessages(threadId);
    const response = messages as MessageType[];
    return c.json(response);
  },
);

const uploadFile = factory.createHandlers(
  zValidator("form", schemas.uploadFileReqSchema),
  async (c) => {
    const { file } = c.req.valid("form");
    const fileObject = await openaiService.uploadFile(file);
    const response = fileObject as FileObjectType;
    return c.json(response);
  },
);

// assistants api用のエンドポイントを設定
const app = new Hono()
  .post("/create_assistant", ...createAssistant)
  .post("/create_thread", ...createThread)
  .post("/add_message", ...addMessage)
  .post("/run_assistant", ...runAssistant)
  .post("/get_run_status", ...getRunStatus)
  .get("/messages/:threadId", ...getMessages)
  .post("/upload_file", ...uploadFile);

export const assistantsRoute = app;
