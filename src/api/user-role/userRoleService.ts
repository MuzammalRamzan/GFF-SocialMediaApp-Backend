import { IUserRoleService } from './interface'
import { UserRole } from './userRoleModel'

export class UserRoleService implements IUserRoleService {
    async fetchUserRole(): Promise<UserRole | null> {
        const role = await UserRole.findOne({
            where: {
                authority: 'user'
            }
        })

        if (!role) {
            return null
        }

        return role
    }
}
