import { User } from "./userModel"

export type UserType = {
    default_currency_id: number
    email: string
    firstname: string
    id: number
    lastname: string
    password: string
    phone_number: string
    role_id: number
}

export interface IUserService {
    list (): Promise<User[]>
    fetchById (id: number): Promise<User>
    fetchByEmail (email: string): Promise<User>
    update (id: number, params: UserType): Promise<Array<any>>
}
