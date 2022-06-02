import { IUserService, UserType } from "./interface";
import { User } from "./userModel";
import { AuthService } from "../auth/authService"

export class UserService implements IUserService {
    private readonly authService: AuthService

    constructor () {
        this.authService = new AuthService()
    }

    async list (): Promise<User[]> {
        const users = await User.findAll()
        
        return users
    }

    async fetchById (id: number): Promise<User> {
        const user = await User.findOne({
            where: {
                id: id
            }
        })

        return user as any
    }

    async fetchByEmail (email: string): Promise<User> {
        const user = await User.findOne({
            where: {
                email:email
            }
        })

        return user as any
    }

    async update (id: number, params: UserType): Promise<[affectedCount: number]> {
        const passwordHash = await this.authService.hashPassword(params.password)

        const updatedRow = await User.update({
            role_id: params.role_id,
            full_name: params.full_name,
            email: params.email, 
            password: passwordHash, 
            default_currency_id: params.default_currency_id,
            user_feature_id: params.user_feature_id
        },
        {
            where: {
                id: id
            }
        })

        return updatedRow
    }

    async delete (id: number): Promise<number> {
        const deletedRow = await User.destroy({
            where: {
                id: id
            }
        })

        return deletedRow
    }
}
