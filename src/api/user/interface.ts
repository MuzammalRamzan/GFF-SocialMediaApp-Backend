export type User = {
    'default_currency_id': number
    email: string
    firstname: string
    id: number
    lastname: string
    password: string
    phone_number: string
    role_id: number
}

export type FetchParams = {}

export interface IUserService {
    list (): Promise<User[]>
    add (params: User): Promise<User>
    fetch (params: FetchParams): Promise<User[]>
}
