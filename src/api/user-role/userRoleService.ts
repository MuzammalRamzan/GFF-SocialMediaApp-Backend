import { IUserRoleService } from './interface'
import { UserRole } from './userRoleModel'

export class UserRoleService implements IUserRoleService {
	async getRoleById(id: number): Promise<UserRole | null> {
		return await UserRole.findByPk(id)
	}

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

	async getAllRoles(): Promise<UserRole[]> {
		return await UserRole.findAll()
	}

	static async fetchWellnessWarriorRole(): Promise<UserRole | null> {
		const role = await UserRole.findOne({
			where: {
				authority: 'warrior'
			}
		})

		if (!role) {
			return null
		}

		return role
	}

	static async fetchAdminRole(): Promise<UserRole | null> {
		const role = await UserRole.findOne({
			where: {
				authority: 'admin'
			}
		})

		if (!role) {
			return null
		}

		return role
	}

	static async fetchMentorRole(): Promise<UserRole | null> {
		const role = await UserRole.findOne({
			where: {
				authority: 'mentor'
			}
		})

		if (!role) {
			return null
		}

		return role
	}
}
