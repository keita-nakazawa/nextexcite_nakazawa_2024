import "reflect-metadata";

import { testClient } from "hono/testing";
import { container } from "tsyringe";
import { app } from "../../app";
import { AssistantsService } from "../services/assistants";
import { MockAssistantsService, mockFileObject } from "../services/assistants.mock";

let testApp: ReturnType<typeof app>;

describe("AssistantsController Unit Tests", () => {
  beforeAll(() => {
    // Set up DI container before tests
    container.register(AssistantsService, { useClass: MockAssistantsService });
    testApp = app();
  });

  afterAll(() => {
    // Clean up DI container after tests
    container.reset();
  });

  it("should retrieve a file", async () => {
    const res = await testClient(testApp).api.main.assistants.retrieve_file2[":fileId"].$get({
      param: { fileId: "test" },
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(mockFileObject);
  });
});
