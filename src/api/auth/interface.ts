import { UserType } from '../user/interface'
import { User } from '../user/userModel'

export type resetPasswordBodyType = {
	password: string
	newPassword: string
}

export type changePasswordBodyType = {
	password: string
	token: string
}

export type resetPasswordRequestBodyType = {
	email: string
}

export interface IAuthService {
	createUser(email: string, fullName: string, password: string, first_name: string, last_name: string): Promise<User>
	checkCreds(email: string, password: string): Promise<UserType | undefined>
	hashPassword(password: string): Promise<string>
	generateJwtToken(email: string, password: string): string
	updatePassword(user_id: number, password: string): Promise<void>
}
