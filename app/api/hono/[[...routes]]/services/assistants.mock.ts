import { FileObjectType } from "@/app/constants/type";
import { injectable } from "tsyringe";
import { AssistantsService } from "./assistants";

export const mockFileObject: FileObjectType = {
  id: "test",
  bytes: 1,
  created_at: 1,
  filename: "test",
  object: "file",
  purpose: "assistants",
  status: "uploaded",
};

@injectable()
export class MockAssistantsService extends AssistantsService {
  public retrieveFile = jest.fn().mockResolvedValue(mockFileObject);
}
