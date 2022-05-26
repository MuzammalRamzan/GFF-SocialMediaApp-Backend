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

    async update (id: number, params: UserType): Promise<Array<any>> {
        const passwordHash = await this.authService.hashPassword(params.password)

        const updatedRow = await User.update({
            role_id: params.role_id,
            firstname: params.firstname,
            lastname: params.lastname,
            email: params.email, 
            password: passwordHash, 
            phone_number: '123456',
            default_currency_id: '1'
        },
        {
            where: {
                id: id
            }
        })

        return updatedRow
    }

    async delete (id: number): Promise<Object> {
        const deletedRow = await User.destroy({
            where: {
                id: id
            }
        })

        return deletedRow
    }
}
