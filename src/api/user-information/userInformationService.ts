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
		await UserInformation.update(
			{
				bio: params.bio,
				date_of_birth: params.date_of_birth,
				gender: params.gender,
				email: params.email,
				phone_number: params.phone_number,
				country: params.country,
				city: params.city,
				state: params.state,
				zip_code: params.zip_code,
				address: params.address,
				twitter: params.twitter,
				facebook: params.facebook,
				linkedin: params.linkedin,
				instagram: params.instagram,
				tiktok: params.tiktok,
				employer_name: params.employer_name,
				job_role: params.job_role,
				education: params.education,
				other_education: params.other_education
			},
			{
				where: {
					user_id: userId
				}
			}
		)

		const updatedRow = await UserInformation.findOne({
			where: {
				user_id: params.user_id
			}
		})
		return updatedRow as UserInformation
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
