import { Assistant } from "openai/resources/beta/assistants.mjs";
import { Thread } from "openai/resources/beta/index.mjs";
import { Run } from "openai/resources/beta/threads/index.mjs";
import { Message } from "openai/resources/beta/threads/messages.mjs";
import { FileObject } from "openai/resources/files.mjs";

type Primitive = string | number | boolean | symbol | bigint | null | undefined;
/**
 * ネストしたtypeを基本型だけの表現へと紐解く
 */
type Flatten<T> = T extends [infer First, ...infer Rest] // タプルの場合
  ? Rest extends []
    ? [Flatten<First>]
    : [Flatten<First>, ...Flatten<Rest>]
  : T extends Array<infer U> // 配列の場合
    ? Flatten<U>[]
    : T extends object // オブジェクトの場合
      ? { [K in keyof T]: Flatten<T[K]> }
      : T extends Primitive // 基本型の場合
        ? T
        : any; // どれにも当てはまらない場合(たぶんunknownのみ)、そのままにするとtRPCが効かなくなるっぽいのでanyに変換しておく

export type AssistantType = Flatten<Assistant>;
export type ThreadType = Flatten<Thread>;
export type MessageType = Flatten<Message>;
export type RunType = Flatten<Run>;
export type FileObjectType = Flatten<FileObject>;
