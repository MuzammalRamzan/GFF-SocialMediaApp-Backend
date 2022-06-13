import { WarriorInformation } from "./warriorInformationModel";

export type WarriorInformationType = {
  user_id: number;
  specialty: string;
  certification: string;
  therapy_type: string;
  price_range: string;
}


export interface IWarriorInformationService {
  getById(user_id: number): Promise<WarriorInformation | null>;
  create: (params: WarriorInformationType) => Promise<WarriorInformation>;
  update: (params: WarriorInformationType) => Promise<WarriorInformation | null>;
}