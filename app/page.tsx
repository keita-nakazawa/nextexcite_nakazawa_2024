import type { InferRequestType } from "hono";
import { SWRConfig, unstable_serialize } from "swr";
import ChatInterface from "./components/ChatInterface";
import { noStoreClient } from "./lib/client";
import { createSWRKey } from "./utils/swr-util";

export default async function Home() {
  // const res = await client.api.main.assistants.retrieve_assistant[":assistantId"].$get({
  //   param: { assistantId: "1" },
  // });
  // const assistant = await res.json();

  const apiRetrieveAssistant = noStoreClient.api.main.assistants.retrieve_assistant;
  const url = apiRetrieveAssistant.$url();
  const arg = { query: { assistantId: "1" } } satisfies InferRequestType<
    typeof apiRetrieveAssistant.$get
  >;

  const key = unstable_serialize(createSWRKey({ url, query: arg.query }));
  return (
    <div className="container">
      <h1>Assistants API App</h1>
      <SWRConfig value={{ fallback: { [key]: "assistant" } }}>
        <ChatInterface />
      </SWRConfig>
    </div>
  );
}
