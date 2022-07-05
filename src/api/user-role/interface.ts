import { UserRole } from './userRoleModel'

export interface IUserRoleService {
    fetchUserRole (): Promise<UserRole | null>
}
