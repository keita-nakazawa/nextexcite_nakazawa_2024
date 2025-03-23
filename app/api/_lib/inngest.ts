import { EventSchemas, Inngest, type LiteralZodEventSchema } from "inngest";
import { z } from "zod";

// イベントの型定義を Zod スキーマで定義
const userSignupEvent = z.object({
  name: z.literal("user/signup"),
  data: z.object({
    userId: z.string(),
    email: z.string().email(),
    name: z.string(),
  }),
}) satisfies LiteralZodEventSchema;

const taskCompletedEvent = z.object({
  name: z.literal("task/completed"),
  data: z.object({
    taskId: z.string(),
    userId: z.string(),
    completedAt: z.string().datetime(),
  }),
}) satisfies LiteralZodEventSchema;

const notificationSendEvent = z.object({
  name: z.literal("notification/send"),
  data: z.object({
    userId: z.string(),
    message: z.string(),
    type: z.string(),
  }),
}) satisfies LiteralZodEventSchema;

// Inngestクライアントの初期化
export const inngest = new Inngest({
  id: "nextexcite-app",
  schemas: new EventSchemas().fromZod([userSignupEvent, taskCompletedEvent, notificationSendEvent]),
  // 本番環境ではInngestのイベントキーを設定する
  // eventKey: process.env.INNGEST_EVENT_KEY,
});
