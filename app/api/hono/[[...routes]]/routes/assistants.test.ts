import "reflect-metadata";

import { FileObjectType } from "@/app/constants/type";
import { testClient } from "hono/testing";
import { container } from "tsyringe";
import { app } from "../app";
import { AssistantsService } from "../services/assistants";

// mockの用意
const mockFileObject: FileObjectType = {
  id: "test",
  bytes: 1,
  created_at: 1,
  filename: "test",
  object: "file",
  purpose: "assistants",
  status: "uploaded",
};
const mockService: Partial<AssistantsService> = {
  retrieveFile: jest.fn().mockResolvedValue(mockFileObject),
};

// mockのDI
container.register(AssistantsService, { useValue: mockService });
const testApp = app();

describe("AssistantsController Unit Tests", () => {
  it("should retrieve a file", async () => {
    const res = await testClient(testApp).api.main.assistants.retrieve_file2[":fileId"].$get({
      param: { fileId: "test" },
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toEqual(mockFileObject);
  });
});
