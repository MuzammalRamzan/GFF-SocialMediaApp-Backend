import { WarriorInformation } from "./warriorInformationModel";

export type WarriorInformationType = {
  user_id: number;
  specialty: string[];
  certification: string[];
  therapy_type: string[];
  price_range: string[];
}

export interface IWarriorUser {
  id: number;
  full_name: string;
  user_information?: {
    profile_url: string;
    bio: string;
    date_of_birth: string;
    gender: string;
    job_role: string;
    education: string;
  },
  warrior_information?: {
    specialty: string[];
    certification: string[];
    therapy_type: string[];
    price_range: string[];
  }
}


export interface IWarriorInformationService {
  getById(user_id: number): Promise<IWarriorUser>;
  create: (params: WarriorInformationType) => Promise<WarriorInformation>;
  update: (params: WarriorInformationType) => Promise<WarriorInformation | null>;
}