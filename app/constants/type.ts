import { Assistant, AssistantTool } from "openai/resources/beta/assistants.mjs";
import { Thread } from "openai/resources/beta/index.mjs";
import { Run } from "openai/resources/beta/threads/index.mjs";
import { Message } from "openai/resources/beta/threads/messages.mjs";
import { FileObject } from "openai/resources/files.mjs";

type BasicPrimitive = string | number | boolean | null | undefined | never;
type Primitive =
  | BasicPrimitive
  | { [key: string]: BasicPrimitive }
  | BasicPrimitive[]
  | { [K in BasicPrimitive & string]: BasicPrimitive };

/**
 * ネストしたtypeを基本型だけの表現に分割する
 */
type Flatten<T> =
  T extends Array<infer U> ? Flatten<U>[] :
  T extends object ? { [K in keyof T]: Flatten<T[K]> } :
  T extends Primitive ? T :
  // どれにも当てはまらない場合(たぶんunknownのみ)、
  // そのままにするとtRPCが効かなくなるっぽいのでとりあえずPrimitiveとしておく
  Primitive

export type AssistantType = Flatten<Assistant>;

export type ThreadType = Flatten<Thread>;

export type MessageType = Flatten<Message>;

export type RunType = Flatten<Run>;

export type FileObjectType = Flatten<FileObject>;

export type AssistantToolType = Flatten<AssistantTool>;
