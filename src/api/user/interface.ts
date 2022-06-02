import { User } from "./userModel"

export type UserType = {
    default_currency_id: number
    email: string
    full_name: string
    id: number
    password: string
    role_id: number
    user_feature_id: number
}

export interface IUserService {
    list (): Promise<User[]>
    fetchById (id: number): Promise<User>
    fetchByEmail (email: string): Promise<User>
    update (id: number, params: UserType): Promise<[affectedCount: number]>
    delete (id: number): Promise<number>
}
