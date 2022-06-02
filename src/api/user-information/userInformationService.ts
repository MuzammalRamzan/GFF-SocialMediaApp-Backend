import { IUserInformationService, UserInformationType } from "./interface";
import { UserInformation } from "./userInformationModel";
import { AuthService } from "../auth/authService"

export class UserInformationService implements IUserInformationService {

    async add (params: UserInformationType): Promise<UserInformation> {
        const userInformation = await UserInformation.create({ 
            user_id: params.user_id,
            bio: params.bio,
            profile_url: params.profile_url,
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
        })

        return userInformation
    }

    async fetchById (user_id: number): Promise<UserInformation> {
        const userInformation = await UserInformation.findOne({
            where: {
                user_id: user_id
            }
        })

        return userInformation as any
    }

    async update (id: number, params: UserInformationType): Promise<[affectedCount: number]> {
        const updatedRow = await UserInformation.update({
            user_id: params.user_id,
            bio: params.bio,
            profile_url: params.profile_url,
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
            other_education: params.other_education,
        },
        {
            where: {
                id: id
            }
        })

        return updatedRow
    }

    async delete (id: number): Promise<number> {
        const deletedRow = await UserInformation.destroy({
            where: {
                id: id
            }
        })

        return deletedRow
    }
}
