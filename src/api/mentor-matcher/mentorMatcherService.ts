import { IMentorMatcherService, IMentorRequest } from "./interface";
import { User } from "../user/userModel"
import { Op } from "sequelize";
import { IMentorMatcher, MentorMatcherModel, MentorMatcherRequestStatus, MentorMatcherRequestType } from "./mentorMatcherModel";

export class MentorMatcherService implements IMentorMatcherService {
  // distance, industry[], role[], frequency[], mode[], name
  async findMentors(userId: number, searchTerm: string): Promise<User[]> {
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

  async myMentors(userId: number): Promise<IMentorRequest[]> {
    const mentors = await MentorMatcherModel.findAll({
      where: {
        mentee_id: userId,
        status: MentorMatcherRequestStatus.APPROVE
      },
      include: [
        {
          model: User,
          as: 'mentor',
          attributes: ['id', 'firstname', 'lastname'],
          foreignKey: 'mentor_id'
        }
      ]
    })

    return mentors.map(mentor => {
      const mentor_request = mentor.get();
      return {
        mentor: mentor_request.mentor.get(),
        request_type: mentor_request.request_type,
        status: mentor_request.status,
        id: mentor_request.id,
        mentor_id: mentor_request.mentor_id,
        mentee_id: mentor_request.mentee_id,
      }
    });
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

  async isFavoriteExist(userId: number, mentor_id: number): Promise<boolean> {
    const mentor = await MentorMatcherModel.findOne({
      where: {
        mentee_id: userId,
        mentor_id: mentor_id,
        request_type: MentorMatcherRequestType.FAVORITE
      }
    })

    return mentor ? true : false;
  }

  async acceptMentorRequest(request_id: number, userId: number, mentee_id: number): Promise<boolean> {
    const data = await MentorMatcherModel.update(
      {
        status: MentorMatcherRequestStatus.APPROVE,
      },
      {
        where: {
          id: request_id,
          mentor_id: userId,
          mentee_id: mentee_id,
          status: MentorMatcherRequestStatus.SEND,
          request_type: MentorMatcherRequestType.MENTOR
        },
        fields: ['status']
      })

    return data[0] ? true : false;
  }

  async rejectMentorRequest(request_id: number, userId: number, mentee_id: number): Promise<boolean> {
    const data = await MentorMatcherModel.update(
      {
        status: MentorMatcherRequestStatus.REJECT,
      },
      {
        where: {
          id: request_id,
          mentor_id: userId,
          mentee_id: mentee_id,
          status: MentorMatcherRequestStatus.SEND,
          request_type: MentorMatcherRequestType.MENTOR
        },
        fields: ['status']
      })

    return data[0] ? true : false;
  }

  async myMentees(userId: number): Promise<IMentorRequest[]> {
    const mentees = await MentorMatcherModel.findAll({
      where: {
        mentor_id: userId,
        status: MentorMatcherRequestStatus.APPROVE
      },
      include: [
        {
          model: User,
          as: 'mentee',
          attributes: ['id', 'firstname', 'lastname'],
          foreignKey: 'mentee_id'
        }
      ]
    })

    return mentees.map(mentee => {
      const mentor_request = mentee.get();
      return {
        mentee: mentor_request.mentee.get(),
        request_type: mentor_request.request_type,
        status: mentor_request.status,
        id: mentor_request.id,
        mentor_id: mentor_request.mentor_id,
        mentee_id: mentor_request.mentee_id,
      }
    });
  }

  async getMentorRequests(userId: number): Promise<IMentorRequest[]> {
    const requests = await MentorMatcherModel.findAll({
      where: {
        mentor_id: userId,
        status: MentorMatcherRequestStatus.SEND
      },
      include: [
        {
          model: User,
          as: 'mentee',
          attributes: ['id', 'firstname', 'lastname'],
          foreignKey: 'mentee_id'
        },
      ]
    })

    return requests.map(request => {
      const mentor_request = request.get();
      return {
        mentee: mentor_request.mentee.get(),
        request_type: mentor_request.request_type,
        status: mentor_request.status,
        id: mentor_request.id,
        mentor_id: mentor_request.mentor_id,
        mentee_id: mentor_request.mentee_id,
      }
    })
  }

  async getMentorRequestsByMenteeId(userId: number): Promise<IMentorRequest[]> {
    const requests = await MentorMatcherModel.findAll({
      where: {
        mentee_id: userId,
        status: MentorMatcherRequestStatus.SEND
      },
      include: [
        {
          model: User,
          as: 'mentor',
          attributes: ['id', 'firstname', 'lastname'],
          foreignKey: 'mentor_id'
        }
      ]
    })

    return requests.map(request => {
      const mentor_request = request.get();
      return {
        mentor: mentor_request.mentor.get(),
        request_type: mentor_request.request_type,
        status: mentor_request.status,
        id: mentor_request.id,
        mentor_id: mentor_request.mentor_id,
        mentee_id: mentor_request.mentee_id,
      }
    })
  }

  async removeMentorFromFavorite(userId: number, mentor_id: number): Promise<boolean> {
    const data = await MentorMatcherModel.destroy({
      where: {
        mentor_id: mentor_id,
        mentee_id: userId,
        request_type: MentorMatcherRequestType.FAVORITE,
      }
    })

    return data ? true : false;
  }

  async addMentorToFavorite(userId: number, mentor_id: number): Promise<boolean> {
    const data = await MentorMatcherModel.create({
      mentor_id: mentor_id,
      mentee_id: userId,
      request_type: MentorMatcherRequestType.FAVORITE,
    })

    return data ? true : false;
  }
}
