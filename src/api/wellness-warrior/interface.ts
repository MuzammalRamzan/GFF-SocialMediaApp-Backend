import { UserInformationType } from '../user-information/interface'
import { WarriorInformationParams, IWarriorUser } from '../warrior-information/interface'
import { IWarriorInformation } from '../warrior-information/warriorInformationModel'
import { WellnessWarrior } from './wellnessWarriorModel'

export const StatusType = {
	SEND: 'send',
	APPROVE: 'approve',
	REJECT: 'reject'
}

export const RequestType = {
	WARRIOR: 'warrior',
	FAVORITE: 'favorite'
}

export interface ISearchWarriorParams {
	searchTerm: string
	specialty?: string
	certification?: string
	therapy_type?: string
	conversation_mode?: string
	min_hourly_rate?: number
	max_hourly_rate?: number
	language?: string
}

export interface IWellnessWarriorRequest {
	id: number
	user_id: number
	warrior_id: number
	status: string
	request_type: string
	user?: {
		id: number
		full_name: string
		user_information?: UserInformationType
	}
	warrior?: {
		id: number
		full_name: string
		user_information?: UserInformationType
		warrior_information?: IWarriorInformation
	}
}

export type removeWarriorParams = { user_id?: number; warrior_id: number } | { user_id: number; warrior_id?: number }

export interface IWellnessWarriorService {
	searchWellnessWarriors(user_id: number, searchParams: ISearchWarriorParams): Promise<IWarriorUser[]>
	sendRequest(user_id: number, warrior_id: number): Promise<IWellnessWarriorRequest>
	approveRequest(user_id: number, request_id: number): Promise<boolean>
	rejectRequest(user_id: number, request_id: number): Promise<boolean>
	getRequest(request_id: number): Promise<IWellnessWarriorRequest>
	getAllRequest(user_id: number): Promise<IWellnessWarriorRequest[]>
	getAllSendedRequest(user_id: number): Promise<IWellnessWarriorRequest[]>
	favoriteWarrior(user_id: number, warrior_id: number): Promise<boolean>
	unfavoriteWarrior(user_id: number, warrior_id: number): Promise<boolean>
	getAllFavoriteWarrior(user_id: number): Promise<WellnessWarrior[]>
	isRequestExist(user_id: number, warrior_id: number): Promise<IWellnessWarriorRequest | null>
	isFavoriteExist(user_id: number, warrior_id: number): Promise<IWellnessWarriorRequest | null>
	getMyWarriors(user_id: number): Promise<IWarriorUser[]>
	removeWarrior(request_id: number, params: removeWarriorParams): Promise<number>
}
