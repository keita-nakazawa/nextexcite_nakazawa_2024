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
import { inject, injectable } from "tsyringe";
import * as schemas from "./req-res-schema";
import { AssistantsService } from "./service";

@injectable()
export class AssistantsController {
  constructor(@inject(AssistantsService) private service: AssistantsService) {}

  private factory = createFactory();

  private createAssistant = this.factory.createHandlers(
    zValidator("json", schemas.createAssistantReqSchema),
    async (c) => {
      const { name, description, instructions, model } = c.req.valid("json");
      const assistant = await this.service.createAssistant(name, description, instructions, model);
      const response = assistant as AssistantType;
      return c.json(response);
    },
  );

  private retrieveAssistant = this.factory.createHandlers(
    zValidator("query", schemas.retrieveAssistantReqSchema),
    async (c) => {
      const { assistantId } = c.req.valid("query");
      const assistant = await this.service.retrieveAssistant(assistantId);
      return c.json(assistant as AssistantType);
    },
  );

  private createThread = this.factory.createHandlers(async (c) => {
    const thread = await this.service.createThread();
    return c.json(thread as ThreadType);
  });

  private addMessage = this.factory.createHandlers(
    zValidator("json", schemas.addMessageReqSchema),
    async (c) => {
      const { threadId, content, files } = c.req.valid("json");
      const message = await this.service.addMessage(threadId, content, files);
      return c.json(message as MessageType);
    },
  );

  private runAssistant = this.factory.createHandlers(
    zValidator("json", schemas.runAssistantReqSchema),
    async (c) => {
      const { assistantId, threadId } = c.req.valid("json");
      const run = await this.service.runAssistant(assistantId, threadId);
      return c.json(run as RunType);
    },
  );

  private getRunStatus = this.factory.createHandlers(
    zValidator("json", schemas.getRunStatusReqSchema),
    async (c) => {
      const { threadId, runId } = c.req.valid("json");
      const run = await this.service.getRunStatus(threadId, runId);
      return c.json(run as RunType);
    },
  );

  private getMessages = this.factory.createHandlers(
    zValidator("param", schemas.getMessagesReqSchema),
    async (c) => {
      const { threadId } = c.req.valid("param");
      const messages = await this.service.getMessages(threadId);
      return c.json(messages as MessageType[]);
    },
  );

  private getFirstMessage = this.factory.createHandlers(
    zValidator("param", schemas.getFirstMessageReqSchema),
    async (c) => {
      const { threadId } = c.req.valid("param");
      const messages = await this.service.getMessages(threadId);
      return c.json(messages[0] as MessageType);
    },
  );

  private uploadAssistantsFile = this.factory.createHandlers(
    zValidator("form", schemas.uploadFileReqSchema),
    async (c) => {
      const { file } = c.req.valid("form");
      const fileObject = await this.service.uploadAssistantsFile(file);
      return c.json(fileObject as FileObjectType);
    },
  );

  private retrieveFile = this.factory.createHandlers(
    zValidator("param", schemas.retrieveFileReqSchema),
    async (c) => {
      const param = c.req.valid("param");
      const fileObject = await this.service.retrieveFile(param);
      return c.json(fileObject);
    },
  );

  private retrieveFile2 = this.factory.createHandlers(
    zValidator("param", schemas.retrieveFileReqSchema),
    async (c) => {
      const param = c.req.valid("param");
      const response = await this.service.retrieveFile(param);
      return c.json(response);
    },
  );

  public get app() {
    return new Hono()
      .post("/create_assistant", ...this.createAssistant)
      .get("/retrieve_assistant", ...this.retrieveAssistant)
      .post("/create_thread", ...this.createThread)
      .post("/add_message", ...this.addMessage)
      .post("/run_assistant", ...this.runAssistant)
      .post("/get_run_status", ...this.getRunStatus)
      .get("/messages/:threadId", ...this.getMessages)
      .get("/first_message/:threadId", ...this.getFirstMessage)
      .post("/upload_file", ...this.uploadAssistantsFile)
      .get("/retrieve_file/:fileId", ...this.retrieveFile)
      .get("/retrieve_file2/:fileId", ...this.retrieveFile2);
  }
}
