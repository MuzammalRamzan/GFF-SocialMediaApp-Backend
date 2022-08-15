import { Request } from 'express'
import { Crew } from './crewModel'

export type CrewType = {
	id: number
	name: string
	created_by: number
}

export interface ICrewService {
	add(params: string, id: number, invite_members: number[]): Promise<Crew[]>
	list(userId: number): Promise<Crew[]>
	fetchById(id: number): Promise<Crew[]>
	update(id: number, params: CrewType): Promise<Crew>
	delete(id: number, userId: number): Promise<number[]>
}

export interface GetCrewByUniqueId extends Request {
	CrewType: CrewType
}

export interface UpdateCrewRequest extends Request {
	CrewType: CrewType
}
