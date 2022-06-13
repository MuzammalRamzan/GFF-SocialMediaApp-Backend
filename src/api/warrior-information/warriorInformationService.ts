import { IWarriorInformationService, WarriorInformationType } from "./interface";
import { WarriorInformation } from "./warriorInformationModel";

export class WarriorInformationService implements IWarriorInformationService {
  constructor() { }

  getById = async (user_id: number): Promise<WarriorInformation | null> => {
    return await WarriorInformation.findOne({
      where: {
        user_id: user_id
      }
    });
  }

  create = async (params: WarriorInformationType): Promise<WarriorInformation> => {
    return await WarriorInformation.create({
      user_id: params.user_id,
      specialty: params.specialty.split(','),
      certification: params.certification.split(','),
      therapy_type: params.therapy_type.split(','),
      price_range: params.price_range.split(','),
    });
  }

  update = async (params: WarriorInformationType): Promise<WarriorInformation | null> => {
    const record = await WarriorInformation.update({
      specialty: params.specialty.split(','),
      certification: params.certification.split(','),
      therapy_type: params.therapy_type.split(','),
      price_range: params.price_range.split(','),
    }, {
      where: {
        user_id: params.user_id,
      },
    });

    return record[0] > 0 ? await WarriorInformation.findOne({ where: { user_id: params.user_id } }) : null;
  }
}