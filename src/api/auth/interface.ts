import { UserType } from "../user/interface"
import { User } from "../user/userModel"

export interface IAuthService {
    createUser (email: string, fullName: string, password: string): Promise<User>
    checkCreds (email: string, password: string): Promise<UserType | undefined>
    hashPassword (password: string): Promise<string>
    generateJwtToken (email: string, password: string): string
}
