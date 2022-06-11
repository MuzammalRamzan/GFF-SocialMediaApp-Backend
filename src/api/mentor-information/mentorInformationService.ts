import { CreateMentorInformation, IMentorInformationService } from "./interface";
import { IMentorInformation, MentorInformation } from "./mentorInformationModel";

export class MentorInformationService implements IMentorInformationService {
  async createMentorInformation(params: CreateMentorInformation): Promise<IMentorInformation> {

    const mentorInformation = await MentorInformation.create({
      role: params.role.join(","),
      industry: params.industry.join(","),
      frequency: params.frequency.join(","),
      conversation_mode: params.conversation_mode.join(","),
      user_id: params.user_id,
      isPassedIRT: params.isPassedIRT
    });

    return mentorInformation.get();
  }

  async isMentorInformationExist(userId: number): Promise<boolean> {
    const mentorInformation = await MentorInformation.findOne({
      where: {
        user_id: userId
      }
    });

    return !!mentorInformation;
  }

  async updateMentorInformation(params: CreateMentorInformation): Promise<IMentorInformation> {
    const mentorInformation = await MentorInformation.findOne({
      where: {
        user_id: params.user_id
      }
    });

    if (!mentorInformation) {
      throw new Error("Mentor information not found");
    }

    await mentorInformation.update({
      role: params.role.join(","),
      industry: params.industry.join(","),
      frequency: params.frequency.join(","),
      conversation_mode: params.conversation_mode.join(","),
      isPassedIRT: params.isPassedIRT
    });

    return mentorInformation.get();
  }
}