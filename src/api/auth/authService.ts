import { IAuthService } from './interface'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../user/userModel'
import { UserType } from '../user/interface'
import { UserRoleService } from '../user-role/userRoleService'
import { CurrencyService } from '../currency/currencyService'

export class AuthService implements IAuthService {
	private readonly userRoleService: UserRoleService
	private readonly currencyService: CurrencyService

	constructor() {
		this.userRoleService = new UserRoleService()
		this.currencyService = new CurrencyService()
	}

	async hashPassword(password: string): Promise<string> {
		const salt = await bcrypt.genSalt(10)

		const hash = await bcrypt.hash(password, salt)

		return hash
	}

	generateJwtToken(email: string, password: string): string {
		const timestamp = Date.now() / 1000
		const token = jwt.sign(
			{
				expiresIn: '30d',
				iat: timestamp,
				email,
				password
			},
			process.env.JWT_SECRET!
		)
		return token
	}

	public static verifyJwtToken(token: string): any {
		return jwt.verify(token, process.env.JWT_SECRET!)
	}

	async createUser(email: string, fullName: string, password: string): Promise<User> {
		const passwordHash = await this.hashPassword(password)
		const userEmail = await this.checkEmail(email)
		const userRole = await this.userRoleService.fetchUserRole()
		const defaultCurrency = await this.currencyService.fetchDefault()

		if (userEmail) {
			throw new Error('User already exist')
		}

		const user = await User.create({
			role_id: userRole?.getDataValue('id'),
			full_name: fullName,
			email: email,
			password: passwordHash,
			default_currency_id: defaultCurrency?.getDataValue('id')
		})

		return user as User
	}

	async checkCreds(email: string, password: string): Promise<UserType | undefined> {
		const user = await this.checkEmail(email)
		if (!user) {
			throw new Error('Wrong username or password!')
		}
		const isValid = await this.checkPass(password, user.password)

		if (!isValid) {
			throw new Error('Password does not match!')
		}
		return user
	}

	async updatePassword(user_id: number, password: string): Promise<void> {
		const hashPassword = await this.hashPassword(password)
		await User.update({ password: hashPassword }, { where: { id: user_id } })
	}

	private async checkEmail(email: string): Promise<UserType> {
		const user = await User.findOne({
			where: {
				email: email
			}
		})
		return user as any
	}

	private async checkPass(pass: string, hashedPass: string): Promise<boolean> {
		return bcrypt.compare(pass, hashedPass)
	}
}
