import { Request } from 'express'
import { Crew } from '../crew/crewModel'
import { CrewMember, CrewMemberInvitationStatus, CrewMemberRole } from './crewMemberModel'

export type CrewMemberType = {
	id: number
	crew_id: number
	user_id: number
	status: CrewMemberInvitationStatus
	role: CrewMemberRole
}

export interface ICrewMemberService {
	add(params: CrewMemberType, id: number): Promise<CrewMember>
	list(crewId: number): Promise<Crew[]>
	fetchById(id: number): Promise<CrewMember[]>
	update(id: number, params: CrewMemberType): Promise<CrewMember>
	delete(id: number): Promise<number>
	listCrewRequest(userId: number): Promise<CrewMember[]>
	acceptRejectCrewRequest(userId: number, crew_id: number, status: string): Promise<String>
}

export interface GetCrewMemberByUniqueId extends Request {
	CrewMemberType: CrewMemberType
}

export interface UpdateCrewMemberRequest extends Request {
	CrewMemberType: CrewMemberType
}

export interface DeleteCrewMemberRequest extends Request {
	id: number
}
