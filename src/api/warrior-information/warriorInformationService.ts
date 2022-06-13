import { UserInformation } from "../user-information/userInformationModel";
import { User } from "../user/userModel";
import { IWarriorInformationService, IWarriorUser, WarriorInformationType } from "./interface";
import { WarriorInformation } from "./warriorInformationModel";

export class WarriorInformationService implements IWarriorInformationService {
  constructor() { }

  private createOrUpdate = async (params: WarriorInformationType): Promise<WarriorInformation> => {
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
      throw new Error("User not found!");
    }

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
      }
    }
  }

  create = async (params: WarriorInformationType): Promise<WarriorInformation> => {
    const warriorInformation = await this.createOrUpdate(params);

    await User.update({
      role_id: 4,
    }, {
      where: {
        id: params.user_id
      }
    })

    return warriorInformation;
  }

  update = async (params: WarriorInformationType): Promise<WarriorInformation | null> => {
    const record = await this.createOrUpdate(params);

    return record ? await WarriorInformation.findOne({ where: { user_id: params.user_id } }) : null;
  }
}