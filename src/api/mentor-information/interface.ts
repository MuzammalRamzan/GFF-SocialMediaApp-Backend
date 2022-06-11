import { IMentorInformation } from "./mentorInformationModel";


export type CreateMentorInformation = {
  user_id: number;
  isPassedIRT: boolean;
  industry: string[];
  role: string[];
  frequency: string[];
  conversation_mode: string[];
}

export interface IMentorInformationService {
  createMentorInformation(params: CreateMentorInformation): Promise<IMentorInformation>;
  isMentorInformationExist(userId: number): Promise<boolean>;
  updateMentorInformation(params: CreateMentorInformation): Promise<IMentorInformation>;
}