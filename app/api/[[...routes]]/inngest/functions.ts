import { inngest } from "../../_lib/inngest";

// 定期実行されるジョブの例（毎日午前8時に実行）
export const dailyReport = inngest.createFunction(
  { id: "daily-report" },
  { cron: "0 8 * * *" }, // 毎日午前8時
  async ({ step }) => {
    await step.sleep("wait-a-moment", "1s");

    // レポート生成ロジックをここに実装
    const report = await step.run("generate-report", async () => {
      console.log("Generating daily report...");
      return { status: "success", reportDate: new Date().toISOString() };
    });

    return { report };
  },
);

// イベントトリガーの関数の例
export const userWelcome = inngest.createFunction(
  { id: "user-welcome-email" },
  { event: "user/signup" },
  async ({ event, step }) => {
    const { userId, email, name } = event.data;

    // メール送信ロジックをここに実装
    const emailResult = await step.run("send-welcome-email", async () => {
      console.log(`Sending welcome email to ${email} for user ${userId}`);
      // メール送信のロジックを実装
      return { sent: true, timestamp: new Date().toISOString() };
    });

    // さらにユーザーへの通知イベントを発生
    if (emailResult.sent) {
      await step.sendEvent("trigger-notification", {
        name: "notification/send",
        data: {
          userId,
          message: `Welcome to our platform, ${name}!`,
          type: "welcome",
        },
      });
    }

    return { success: true, userId, emailSent: emailResult };
  },
);

// 別のイベントに反応する関数
export const sendNotification = inngest.createFunction(
  { id: "send-notification" },
  { event: "notification/send" },
  async ({ event, step }) => {
    const { userId, message, type } = event.data;

    // 通知処理のロジックをここに実装
    const result = await step.run("process-notification", async () => {
      console.log(`Sending ${type} notification to user ${userId}: ${message}`);
      // 実際の通知ロジック（プッシュ通知、SMSなど）
      return { delivered: true, channel: "app", timestamp: new Date().toISOString() };
    });

    return { success: true, notificationResult: result };
  },
);

// タスク完了時のイベントを処理する関数
export const handleTaskCompletion = inngest.createFunction(
  { id: "task-completed-handler" },
  { event: "task/completed" },
  async ({ event, step }) => {
    const { taskId, userId } = event.data;

    // タスク完了後の処理をここに実装
    const result = await step.run("update-user-stats", async () => {
      console.log(`Updating stats for user ${userId} after completing task ${taskId}`);
      // ユーザーの統計データ更新処理など
      return { updated: true };
    });

    return { processed: true, taskId, result };
  },
);

// すべての関数をエクスポート
export const functions = [dailyReport, userWelcome, sendNotification, handleTaskCompletion];
