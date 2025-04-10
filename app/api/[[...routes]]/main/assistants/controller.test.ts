import "reflect-metadata";

import type { FileObjectType } from "@/app/constants/type";
import { testClient } from "hono/testing";
import { container } from "tsyringe";
import { setupMainRoutes } from "../../app";
import { AssistantsService } from "./service";

describe("AssistantsController Unit Tests", () => {
  let service: AssistantsService;

  beforeEach(() => {
    // Unlike with container.reset(), the registrations themselves are not cleared. This is especially useful for testing:
    container.clearInstances();
    service = container.resolve(AssistantsService);
    jest.restoreAllMocks();
  });

  afterAll(() => {
    // Clean up DI container after tests
    container.reset();
  });

  it("should retrieve a file", async () => {
    const FILE_ID = "test";
    const mockFileObject = {
      id: FILE_ID,
      bytes: 1,
      created_at: 1,
      filename: "test",
      object: "file",
      purpose: "assistants",
      status: "uploaded",
    } satisfies FileObjectType;
    const retrieveFileSpy = jest.spyOn(service, "retrieveFile").mockResolvedValue(mockFileObject);
    container.registerInstance(AssistantsService, service);

    const res = await testClient(setupMainRoutes()).api.main.assistants.retrieve_file[
      ":fileId"
    ].$get({
      param: { fileId: FILE_ID },
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(mockFileObject);

    expect(retrieveFileSpy).toHaveBeenCalledWith({ fileId: FILE_ID });
    expect(retrieveFileSpy).toHaveBeenCalledTimes(1);
  });

  it("should retrieve a file 2", async () => {
    const FILE_ID = "test";
    const mockFileObject = {
      id: FILE_ID,
      bytes: 1,
      created_at: 1,
      filename: "test",
      object: "file",
      purpose: "assistants",
      status: "uploaded",
    } satisfies FileObjectType;
    const retrieveFileSpy = jest.spyOn(service, "retrieveFile").mockResolvedValue(mockFileObject);
    container.registerInstance(AssistantsService, service);

    const res = await testClient(setupMainRoutes()).api.main.assistants.retrieve_file2[
      ":fileId"
    ].$get({
      param: { fileId: FILE_ID },
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(mockFileObject);

    expect(retrieveFileSpy).toHaveBeenCalledWith({ fileId: FILE_ID });
    expect(retrieveFileSpy).toHaveBeenCalledTimes(1);
  });
});
