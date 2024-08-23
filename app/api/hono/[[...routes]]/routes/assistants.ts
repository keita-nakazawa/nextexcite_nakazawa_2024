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

const retrieveAssistant = factory.createHandlers(
  zValidator("param", schemas.retrieveAssistantReqSchema),
  async (c) => {
    const { assistantId } = c.req.valid("param");
    const assistant = await openaiService.retrieveAssistant(assistantId);
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
    const { threadId, content, files } = c.req.valid("json");
    const message = await openaiService.addMessage(threadId, content, files);
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

const getFirstMessage = factory.createHandlers(
  zValidator("param", schemas.getFirstMessageReqSchema),
  async (c) => {
    const { threadId } = c.req.valid("param");
    const messages = await openaiService.getMessages(threadId);
    const response = messages[0] as MessageType;
    return c.json(response);
  },
);

const uploadAssistantsFile = factory.createHandlers(
  zValidator("form", schemas.uploadFileReqSchema),
  async (c) => {
    const { file } = c.req.valid("form");
    const fileObject = await openaiService.uploadAssistantsFile(file);
    const response = fileObject as FileObjectType;
    return c.json(response);
  },
);

const retrieveFile = factory.createHandlers(
  zValidator("param", schemas.retrieveFileReqSchema),
  async (c) => {
    const { fileId } = c.req.valid("param");
    const fileObject = await openaiService.retrieveFile(fileId);
    const response = fileObject as FileObjectType;
    return c.json(response);
  },
);

// assistants api用のエンドポイントを設定
const app = new Hono()
  .post("/create_assistant", ...createAssistant)
  .get("/retrieve_assistant/:assistantId", ...retrieveAssistant)
  .post("/create_thread", ...createThread)
  .post("/add_message", ...addMessage)
  .post("/run_assistant", ...runAssistant)
  .post("/get_run_status", ...getRunStatus)
  .get("/messages/:threadId", ...getMessages)
  .get("/first_message/:threadId", ...getFirstMessage)
  .post("/upload_file", ...uploadAssistantsFile)
  .get("/retrieve_file/:fileId", ...retrieveFile);

export const assistantsRoute = app;
