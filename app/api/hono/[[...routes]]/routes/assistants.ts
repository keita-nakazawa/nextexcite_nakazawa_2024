import {
  AssistantType,
  FileObjectType,
  MessageType,
  RunType,
  ThreadType,
} from "@/app/constants/type";
import { Hono, type Context } from "hono";
import { inject, injectable } from "tsyringe";
import * as schemas from "../schemas/assistants";
import { AssistantsService } from "../services/assistants";

@injectable()
export class AssistantsController {
  constructor(@inject(AssistantsService) private service: AssistantsService) {}

  private createAssistant = async (c: Context) => {
    const { name, description, instructions, model } = schemas.createAssistantReqSchema.parse(
      await c.req.json(),
    );
    const assistant = await this.service.createAssistant(name, description, instructions, model);
    return c.json(assistant as AssistantType);
  };

  private retrieveAssistant = async (c: Context) => {
    const { assistantId } = schemas.retrieveAssistantReqSchema.parse(c.req.param());
    const assistant = await this.service.retrieveAssistant(assistantId);
    return c.json(assistant as AssistantType);
  };

  private createThread = async (c: Context) => {
    const thread = await this.service.createThread();
    return c.json(thread as ThreadType);
  };

  private addMessage = async (c: Context) => {
    const { threadId, content, files } = schemas.addMessageReqSchema.parse(await c.req.json());
    const message = await this.service.addMessage(threadId, content, files);
    return c.json(message as MessageType);
  };

  private runAssistant = async (c: Context) => {
    const { assistantId, threadId } = schemas.runAssistantReqSchema.parse(await c.req.json());
    const run = await this.service.runAssistant(assistantId, threadId);
    return c.json(run as RunType);
  };

  private getRunStatus = async (c: Context) => {
    const { threadId, runId } = schemas.getRunStatusReqSchema.parse(await c.req.json());
    const run = await this.service.getRunStatus(threadId, runId);
    return c.json(run as RunType);
  };

  private getMessages = async (c: Context) => {
    const { threadId } = schemas.getMessagesReqSchema.parse(c.req.param());
    const messages = await this.service.getMessages(threadId);
    return c.json(messages as MessageType[]);
  };

  private getFirstMessage = async (c: Context) => {
    const { threadId } = schemas.getFirstMessageReqSchema.parse(c.req.param());
    const messages = await this.service.getMessages(threadId);
    return c.json(messages[0] as MessageType);
  };

  private uploadAssistantsFile = async (c: Context) => {
    const { file } = schemas.uploadFileReqSchema.parse(await c.req.parseBody());
    const fileObject = await this.service.uploadAssistantsFile(file);
    return c.json(fileObject as FileObjectType);
  };

  private retrieveFile = async (c: Context) => {
    const param = schemas.retrieveFileReqSchema.parse(c.req.param());
    const fileObject = await this.service.retrieveFile(param);
    return c.json(fileObject);
  };

  private retrieveFile2 = async (c: Context) => {
    const param = schemas.retrieveFileReqSchema.parse(c.req.param());
    const response = await this.service.retrieveFile(param);
    return c.json(response);
  };

  public get app() {
    return new Hono()
      .post("/create_assistant", this.createAssistant)
      .get("/retrieve_assistant/:assistantId", this.retrieveAssistant)
      .post("/create_thread", this.createThread)
      .post("/add_message", this.addMessage)
      .post("/run_assistant", this.runAssistant)
      .post("/get_run_status", this.getRunStatus)
      .get("/messages/:threadId", this.getMessages)
      .get("/first_message/:threadId", this.getFirstMessage)
      .post("/upload_file", this.uploadAssistantsFile)
      .get("/retrieve_file/:fileId", this.retrieveFile)
      .get("/retrieve_file2/:fileId", this.retrieveFile2);
  }
}
