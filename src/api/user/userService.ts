import { ISearchUser, IUserService, UserType } from "./interface";
import { User } from "./userModel";
import { AuthService } from "../auth/authService"
import { Op } from "sequelize";
import bcrypt from 'bcrypt';

export class UserService implements IUserService {
    private readonly authService: AuthService

    constructor() {
        this.authService = new AuthService()
    }

    async list(): Promise<User[]> {
        const users = await User.findAll()

        return users
    }

    async fetchById(id: number, userId: number): Promise<User> {
        if(id != userId) {
            throw new Error("Unauthorized")
        }

        const user = await User.findOne({
            where: {
                id: userId
            }
        })

        return user as any
    }

    async fetchByEmail(email: string, userId: number): Promise<User> {
        const user = await User.findOne({
            where: {
                email: email,
                id: userId
            }
        })

        if(!user){
            throw new Error("Unauthorized")
        }

        return user as any
    }

    static async findByEmail(email: string): Promise<User> {
        const user = await User.findOne({
            where: {
                email: email
            }
        })

        return user as User;
    }

    async update(paramsId: number, params: UserType): Promise<User> {
        if(paramsId !== params.id){
            throw new Error("Unauthorized")
        }
        let passwordHash
        if(params.password){
            passwordHash = await this.authService.hashPassword(params.password)
        }

        await User.update({
            role_id: params.role_id,
            full_name: params.full_name,
            email: params.email, 
            password: passwordHash, 
            default_currency_id: params.default_currency_id,
            user_feature_id: params.user_feature_id
        },
            {
                where: {
                    id: params.id
                }
            })

            const newUpdatedRow = await User.findByPk(paramsId)
            return newUpdatedRow as User   
    }

    async delete(id: number, userId: number): Promise<number> {
        if(userId !== id){
            throw new Error("Unauthorized")
        }
        const deletedRow = await User.destroy({
            where: {
                id: userId
            }
        })

        return deletedRow
    }

    async searchFriend(searchTerm: string, userId: number): Promise<ISearchUser[]> {
        const user = await User.findAll({
            where: {
                [Op.or]: [
                    {
                        firstname: {
                            [Op.like]: `%${searchTerm}%`
                        },
                    },
                    {
                        lastname: {
                            [Op.like]: `%${searchTerm}%`
                        }
                    }
                ],
                id: {
                    [Op.ne]: userId
                }
            }
        })

        return user.map(user => {
            const data = user.get();
            return {
                id: data.id,
                firstname: data.firstname,
                lastname: data.lastname,
            }
        })
    }
}
