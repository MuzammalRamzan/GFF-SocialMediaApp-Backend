import { IUserInformationService, UserInformationType } from './interface'
import { UserInformation } from './userInformationModel'
import { AuthService } from '../auth/authService'

export class UserInformationService implements IUserInformationService {
	async add(params: UserInformationType): Promise<UserInformation> {
		try {
			// find or update
			const userInformation = await UserInformation.findOne({
				where: {
					user_id: params.user_id
				}
			})

			if (userInformation) {
				return await this.update(params.user_id, params)
			} else {
				return await UserInformation.create(params)
			}
		} catch (err) {
			throw new Error('User information already exists')
		}
	}

	async fetchById(params_user_id: number, userId: number): Promise<UserInformation> {
		if (params_user_id !== userId) {
			throw new Error('Unauthorized')
		}
		const userInformation = await UserInformation.findOne({
			where: {
				user_id: userId
			}
		})

		return userInformation as any
	}

	async update(userId: number, params: UserInformationType): Promise<UserInformation> {
		const userInformation = await UserInformation.findOne({
			where: {
				user_id: userId
			}
		});

		if (userInformation) {
			userInformation.set(params);
			return await userInformation.save();
		} else {
			return await UserInformation.create(params);
		}
	}

	async delete(params_user_id: number, userId: number): Promise<number> {
		if (params_user_id !== userId) {
			throw new Error('Unauthorized')
		}
		const deletedRow = await UserInformation.destroy({
			where: {
				user_id: userId
			}
		})

		return deletedRow
	}

	async updateUserProfileUrl(profile_url: string, userId: number): Promise<UserInformation> {
		const userInformation = await UserInformation.findOne({
			where: {
				user_id: userId
			}
		});

		if (userInformation) {
			userInformation.set('profile_url', profile_url);
			return await userInformation.save();
		} else {
			return await UserInformation.create({
				user_id: userId,
				profile_url: profile_url
			});
		}
	}
}
