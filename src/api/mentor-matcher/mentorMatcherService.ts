import { IMentorMatcherService } from "./interface";
import { User } from "../user/userModel"
import { Op } from "sequelize";
import { IMentorMatcher, MentorMatcherModel, MentorMatcherRequestStatus, MentorMatcherRequestType } from "./mentorMatcherModel";

export class MentorMatcherService implements IMentorMatcherService {
  async findMentors(userId: number, searchTerm: string): Promise<any[]> {
    const mentors = await User.findAll({
      where: {
        id: {
          [Op.ne]: userId
        },
        [Op.or]: [
          {
            firstname: {
              [Op.like]: `%${searchTerm}%`
            }
          },
          {
            lastname: {
              [Op.like]: `%${searchTerm}%`
            }
          }
        ]
      }
    })

    return mentors;
  }

  async myMentors(userId: number): Promise<any[]> {
    const mentors = await MentorMatcherModel.findAll({
      where: {
        mentee_id: userId
      }
    })

    return mentors;
  }

  async sendMentorRequest(userId: number, mentor_id: number): Promise<IMentorMatcher> {
    const mentor = await MentorMatcherModel.create({
      mentor_id: mentor_id,
      mentee_id: userId,
      request_type: MentorMatcherRequestType.MENTOR,
      status: MentorMatcherRequestStatus.SEND
    })

    return mentor.get();
  }

  async isExist(userId: number, mentor_id: number): Promise<boolean> {
    const mentor = await MentorMatcherModel.findOne({
      where: {
        mentee_id: userId,
        mentor_id: mentor_id
      }
    })

    return mentor ? true : false;
  }

  async acceptMentorRequest(request_id: number, userId: number, mentor_id: number): Promise<boolean> {
    const data = await MentorMatcherModel.update(
      {
        status: MentorMatcherRequestStatus.APPROVE,
      },
      {
        where: {
          id: request_id,
          mentee_id: userId,
          mentor_id: mentor_id,
          status: MentorMatcherRequestStatus.SEND,
          request_type: MentorMatcherRequestType.MENTOR
        },
        fields: ['status']
      })

    return data[0] ? true : false;
  }

  async rejectMentorRequest(request_id: number, userId: number, mentor_id: number): Promise<boolean> {
    const data = await MentorMatcherModel.update(
      {
        status: MentorMatcherRequestStatus.REJECT,
      },
      {
        where: {
          id: request_id,
          mentee_id: userId,
          mentor_id: mentor_id,
          status: MentorMatcherRequestStatus.SEND,
          request_type: MentorMatcherRequestType.MENTOR
        },
        fields: ['status']
      })

    return data[0] ? true : false;
  }

  async myMentees(userId: number): Promise<any[]> {
    const mentees = await MentorMatcherModel.findAll({
      where: {
        mentor_id: userId
      }
    })

    return mentees;
  }
}
