import { MENTOR_ROLE_ID } from "../../constants";
import { MentorMatcherModel } from "../mentor-matcher/mentorMatcherModel";
import { MentorMatcherService } from "../mentor-matcher/mentorMatcherService";
import { UserInformation } from "../user-information/userInformationModel";
import { User } from "../user/userModel";
import { CreateMentorInformation, IMentorInformationService, MentorInformationType } from "./interface";
import { IMentorInformation, MentorInformation } from "./mentorInformationModel";

export class MentorInformationService implements IMentorInformationService {

  static async isMentorExists(userId: number): Promise<boolean> {
    const record = await User.findOne({
      where: {
        id: userId,
        role_id: MENTOR_ROLE_ID
      }
    });

    return !!record?.get();
  }

  async createMentorInformation(params: CreateMentorInformation): Promise<IMentorInformation> {

    const mentorInformation = await MentorInformation.create({
      role: params.role.join(","),
      industry: params.industry.join(","),
      frequency: params.frequency.join(","),
      conversation_mode: params.conversation_mode.join(","),
      user_id: params.user_id,
      isPassedIRT: params.isPassedIRT
    });

    // make user as a mentor, change the role_id of User table.
    await User.update(
      {
        role_id: 3
      },
      {
        where: {
          id: params.user_id
        }
      }
    )

    return mentorInformation.get();
  }

  async isMentorInformationExist(userId: number): Promise<boolean> {
    const mentorInformation = await MentorInformation.findOne({
      where: {
        user_id: userId
      }
    });

    return !!mentorInformation?.get();
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

  async getMentorInformation(userId: number, mentor_id: number): Promise<MentorInformationType> {
    const mentorInformation = await MentorInformation.findOne({
      where: {
        user_id: mentor_id
      },
      attributes: ["isPassedIRT", "industry", "role", "frequency", "conversation_mode"]
    });

    if (!mentorInformation) {
      throw new Error("Mentor information not found");
    }

    const userInformation = await UserInformation.findOne({
      where: {
        user_id: mentor_id
      },
      attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education']
    })

    const mentor_request = await MentorMatcherService.isExist(userId, mentor_id) as any;

    return {
      id: mentor_id,
      user_information: userInformation?.get(),
      mentor_information: mentorInformation.get(),
      mentor_request: mentor_request
    };
  }
}