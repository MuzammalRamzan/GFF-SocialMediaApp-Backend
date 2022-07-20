import { UserInformationType } from '../user-information/interface'
import { IWellnessWarriorRequest } from '../wellness-warrior/interface'
import { WellnessWarrior } from '../wellness-warrior/wellnessWarriorModel'
import { WarriorInformation } from './warriorInformationModel'

export type WarriorInformationParams = {
	user_id: number
	specialty: string[]
	certification: string[]
	therapy_type: string[]
	price_range: string[]
}

export interface IWarriorUser {
	id: number
	full_name: string
	user_information?: UserInformationType
	warrior_information?: {
		specialty: string[]
		certification: string[]
		therapy_type: string[]
		price_range: string[]
	}
	wellness_warrior_request?: IWellnessWarriorRequest | null
}

export interface IWarriorInformationService {
	getById(user_id: number): Promise<IWarriorUser>
	getAll(): Promise<WarriorInformation[]>
	create(params: WarriorInformationParams): Promise<WarriorInformation>
	update(params: WarriorInformationParams): Promise<WarriorInformation | null>
}
