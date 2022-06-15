import { Op } from "sequelize";
import { UserInformation } from "../user-information/userInformationModel";
import { User } from "../user/userModel";
import { IWarriorUser } from "../warrior-information/interface";
import { WarriorInformation } from "../warrior-information/warriorInformationModel";
import { ISearchWarriorParams, IWellnessWarriorRequest, IWellnessWarriorService, RequestType, StatusType } from "./interface";
import { WellnessWarrior } from "./wellnessWarriorModel";

export class WellnessWarriorService implements IWellnessWarriorService {
  constructor() { }

  private async getById(id: number): Promise<IWellnessWarriorRequest | null> {
    const record = await WellnessWarrior.findOne({
      where: {
        id
      },
      include: [
        {
          model: User,
          as: "warrior",
          foreignKey: "warrior_id",
          attributes: ["id", "full_name"],
          include: [
            {
              model: UserInformation,
              as: "user_information",
              attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education'],
            },
          ]
        },
        {
          model: User,
          as: "user",
          foreignKey: "user_id",
          attributes: ["id", "full_name"],
          include: [
            {
              model: UserInformation,
              as: "user_information",
              attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education'],
            }
          ]
        }
      ]
    });

    return record ? record.get() : null;
  }

  async searchWellnessWarriors(user_id: number, searchParams: ISearchWarriorParams): Promise<IWarriorUser[]> {

    const _specialty = searchParams.specialty?.split(',');
    const _certification = searchParams.certification?.split(',');
    const _therapy_type = searchParams.therapy_type?.split(',');
    const _price_range = searchParams.price_range?.split(',');

    const records = await User.findAll({
      where: {
        full_name: {
          [Op.like]: `%${searchParams.searchTerm.trim()}%`
        },
        role_id: 4,
        id: {
          [Op.not]: user_id
        }

      },
      include: [
        {
          model: WarriorInformation,
          as: "warrior_information",
          attributes: ["specialty", "certification", "therapy_type", "price_range"],
          where: {
            [Op.or]: [
              {
                specialty: {
                  [Op.or]: _specialty?.map((specialty: string) => ({
                    [Op.like]: `%${specialty.trim()}%`
                  }))
                },
              },
              {
                certification: {
                  [Op.or]: _certification?.map((certification: string) => ({
                    [Op.like]: `%${certification.trim()}%`
                  }))
                },
              },
              {
                therapy_type: {
                  [Op.or]: _therapy_type?.map((therapy_type: string) => ({
                    [Op.like]: `%${therapy_type.trim()}%`
                  }))
                }
              },
              {
                price_range: {
                  [Op.or]: _price_range?.map((price_range: string) => ({
                    [Op.like]: `%${price_range.trim()}%`
                  }))
                }
              }
            ]
          }
        },
        {
          model: UserInformation,
          as: "user_information",
          attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education'],
        }
      ]
    });

    return records.map(record => {
      const user = record.get();

      return {
        id: user.id,
        full_name: user.full_name,
        user_information: user.user_information,
        warrior_information: {
          specialty: user?.warrior_information?.specialty?.split(","),
          certification: user?.warrior_information?.certification?.split(","),
          therapy_type: user?.warrior_information?.therapy_type?.split(","),
          price_range: user?.warrior_information?.price_range?.split(",")
        }
      }
    })
  }

  async isRequestExist(user_id: number, warrior_id: number): Promise<boolean> {
    const record = await WellnessWarrior.findOne({
      where: {
        user_id,
        warrior_id,
        request_type: RequestType.WARRIOR,
      }
    });

    return !!record;
  }

  async sendRequest(user_id: number, warrior_id: number): Promise<IWellnessWarriorRequest> {
    const record = await WellnessWarrior.create({
      user_id,
      warrior_id,
    });

    return record.get();
  }

  async approveRequest(user_id: number, request_id: number): Promise<IWellnessWarriorRequest | null> {
    const record = await WellnessWarrior.update({
      status: StatusType.APPROVE
    }, {
      where: {
        warrior_id: user_id,
        id: request_id,
        status: StatusType.SEND,
        request_type: RequestType.WARRIOR
      }
    });

    return await this.getById(request_id);

  }

  async rejectRequest(user_id: number, request_id: number): Promise<IWellnessWarriorRequest | null> {
    const record = await WellnessWarrior.update({
      status: StatusType.REJECT
    }, {
      where: {
        warrior_id: user_id,
        id: request_id,
        status: StatusType.SEND,
        request_type: RequestType.WARRIOR
      }
    });

    return await this.getById(request_id);
  }

  async getRequest(request_id: number): Promise<IWellnessWarriorRequest> {
    const record = await WellnessWarrior.findOne({
      where: {
        id: request_id,
        request_type: RequestType.WARRIOR
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "full_name"],
          include: [
            {
              model: UserInformation,
              as: "user_information",
              attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education'],
            }
          ]
        },
        {
          model: User,
          as: "warrior",
          attributes: ["id", "full_name"],
          include: [
            {
              model: UserInformation,
              as: "user_information",
              attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education'],
            }
          ]
        }
      ]
    });

    return record?.get();
  }

  async getAllRequest(user_id: number): Promise<IWellnessWarriorRequest[]> {
    const records = await WellnessWarrior.findAll({
      where: {
        warrior_id: user_id,
        request_type: RequestType.WARRIOR,
        status: StatusType.SEND
      }
    });

    return records.map(record => record.get());
  }

  async getAllSendedRequest(user_id: number): Promise<IWellnessWarriorRequest[]> {
    const records = await WellnessWarrior.findAll({
      where: {
        user_id,
        request_type: RequestType.WARRIOR,
        status: StatusType.SEND
      }
    });

    return records.map(record => record.get());
  }

  async isFavoriteExist(user_id: number, warrior_id: number): Promise<boolean> {
    const record = await WellnessWarrior.findOne({
      where: {
        user_id,
        warrior_id,
        request_type: RequestType.FAVORITE,
      }
    });

    return !!record;
  }

  async favoriteWarrior(user_id: number, warrior_id: number): Promise<boolean> {
    const record = await WellnessWarrior.create({
      user_id,
      warrior_id,
      request_type: RequestType.FAVORITE,
    });

    return !!record;
  }

  async unfavoriteWarrior(user_id: number, warrior_id: number): Promise<boolean> {
    const record = await WellnessWarrior.destroy({
      where: {
        user_id,
        warrior_id,
        request_type: RequestType.FAVORITE,
      }
    });

    return !!record;
  }

  async getAllFavoriteWarrior(user_id: number): Promise<WellnessWarrior[]> {
    const records = await WellnessWarrior.findAll({
      where: {
        user_id,
        request_type: RequestType.FAVORITE,
        status: StatusType.APPROVE
      },
      include: [
        {
          model: User,
          as: "warrior",
          foreignKey: "warrior_id",
          attributes: ["id", "full_name"],
          include: [
            {
              model: UserInformation,
              as: "user_information",
              attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education'],
            }
          ]
        }
      ]
    });

    return records;
  }

  static async getWarriorRequestByUserId(userId: number): Promise<IWellnessWarriorRequest | null> {
    const record = await WellnessWarrior.findOne({
      where: {
        user_id: userId,
        request_type: RequestType.WARRIOR,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "full_name"],
          include: [
            {
              model: UserInformation,
              as: "user_information",
              attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education'],
            }
          ]
        },
        {
          model: User,
          as: 'warrior',
          attributes: ["id", "full_name"],
          include: [
            {
              model: UserInformation,
              as: "user_information",
              attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education'],
            }
          ]
        }
      ]
    });

    return record?.get();
  }
}