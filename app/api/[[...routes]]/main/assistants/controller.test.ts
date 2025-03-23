import "reflect-metadata";

import { testClient } from "hono/testing";
import { container } from "tsyringe";
import { setupMainRoutes } from "../../app";
import { AssistantsService } from "./service";
import { MockAssistantsService, mockFileObject } from "./service.mock";

let testApp: ReturnType<typeof setupMainRoutes>;

describe("AssistantsController Unit Tests", () => {
  beforeAll(() => {
    // Set up DI container before tests
    container.register(AssistantsService, { useClass: MockAssistantsService });
    testApp = setupMainRoutes();
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
