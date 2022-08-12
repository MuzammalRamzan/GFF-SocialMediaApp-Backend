import { Request } from 'express'
import { UserFCMTokens } from './userFCMTokensModel'
import { UserType } from '../user/interface'

export type PaginatedUserResult = { rows: UserFCMTokens[]; count: number; page?: number; pageSize?: number }

export const Messages = {
	TOKEN_EXISTS: 'Token already exists!',
	TOKEN_NOT_FOUND: 'Token not found!',
	TOKEN_DELETED: 'Token deleted successfully!',
}

export interface IUserFCMTokenService {
	addFcmToken(userId: number, token: string): Promise<UserFCMTokens>
	deleteFcmToken(userId: number, token: string): Promise<void>
	getUserTokens(userId: number): Promise<UserFCMTokens[]>

}

export interface FCMTokenRequest extends Request {
	token: string
	user: UserType
}
