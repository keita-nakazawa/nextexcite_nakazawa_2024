import { inngest } from "@/app/lib/inngest";

export const processImage = inngest.createFunction(
  { id: "Process Image" },
  { event: "image.process" },
  async ({ event, step }) => {
    const { imageUrl } = event.data;

    await step.run("Process image", async () => {
      await new Promise((resolve) => setTimeout(resolve, 30000)); // 30秒待機
      return { step1: "done" };
    });

    await step.run("Save result", async () => {
      console.log(`Processed image: ${imageUrl}`);
      return { step2: "done" };
    });

    return { processedImageUrl: `processed-${imageUrl}` };
  },
);
