import { WELLNESS_WARRIOR_ROLE_ID } from "../../constants";
import { GffError } from "../helper/errorHandler";
import { UserInformation } from "../user-information/userInformationModel";
import { User } from "../user/userModel";
import { WellnessWarriorService } from "../wellness-warrior/wellnessWarriorService";
import { IWarriorInformationService, IWarriorUser, WarriorInformationParams } from "./interface";
import { WarriorInformation } from "./warriorInformationModel";

export class WarriorInformationService implements IWarriorInformationService {
  constructor() { }

  private createOrUpdate = async (params: WarriorInformationParams): Promise<WarriorInformation> => {
    const warriorInformation = await WarriorInformation.findOne({
      where: {
        user_id: params.user_id
      }
    });

    const payload = {
      specialty: params.specialty.join(','),
      certification: params.certification.join(','),
      therapy_type: params.therapy_type.join(','),
      price_range: params.price_range.join(','),
    }

    if (warriorInformation) {
      return await warriorInformation.update(payload);
    } else {
      return await WarriorInformation.create(payload);
    }
  }

  getById = async (user_id: number): Promise<IWarriorUser> => {
    const record = await User.findOne({
      where: {
        id: user_id
      },
      attributes: ['id', 'full_name'],
      include: [
        {
          model: WarriorInformation,
          as: "warrior_information",
          attributes: ["specialty", "certification", "therapy_type", "price_range"]
        },
        {
          model: UserInformation,
          as: "user_information",
          attributes: ["profile_url", "bio", "date_of_birth", "gender", "job_role", "education"]
        }
      ]
    });

    if (!record) {
      const error = new GffError('Wellness Warrior information not found!')
      error.errorCode = '404'
      throw error
    }

    const wellness_warrior_request = await WellnessWarriorService.getWarriorRequestByUserId(user_id);

    const user = record?.get();

    return {
      id: user.id,
      full_name: user.full_name,
      user_information: user.user_information,
      warrior_information: {
        specialty: user.warrior_information?.specialty.split(','),
        certification: user.warrior_information?.certification.split(','),
        therapy_type: user.warrior_information?.therapy_type.split(','),
        price_range: user.warrior_information?.price_range.split(','),
      },
      wellness_warrior_request: wellness_warrior_request
    }
  }

  create = async (params: WarriorInformationParams): Promise<WarriorInformation> => {
    const warriorInformation = await this.createOrUpdate(params);

    await User.update({
      role_id: WELLNESS_WARRIOR_ROLE_ID,
    }, {
      where: {
        id: params.user_id
      }
    })

    return warriorInformation.get();
  }

  update = async (params: WarriorInformationParams): Promise<WarriorInformation | null> => {
    const record = await this.createOrUpdate(params);

    return record ? await WarriorInformation.findOne({ where: { user_id: params.user_id } }) : null;
  }

  static isUserWarrior = async (user_id: number): Promise<boolean> => {
    const record = await User.findOne({
      where: {
        id: user_id,
        role_id: WELLNESS_WARRIOR_ROLE_ID
      }
    });

    return !!record?.get();
  }
}