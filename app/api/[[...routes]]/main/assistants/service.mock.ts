import { FileObjectType } from "@/app/constants/type";
import { injectable } from "tsyringe";
import { AssistantsService } from "./service";

export const mockFileObject = {
  id: "test",
  bytes: 1,
  created_at: 1,
  filename: "test",
  object: "file",
  purpose: "assistants",
  status: "uploaded",
} satisfies FileObjectType;

@injectable()
export class MockAssistantsService extends AssistantsService {
  public retrieveFile = jest.fn().mockResolvedValue(mockFileObject);
}
