import { UserRole } from './userRoleModel'

export interface IUserRoleService {
	getRoleById(id: number): Promise<UserRole | null>
	fetchUserRole(): Promise<UserRole | null>
	getAllRoles(): Promise<UserRole[]>
}
