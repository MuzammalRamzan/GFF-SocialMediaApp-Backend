import { Request } from 'express'
import { UserType } from '../user/interface'
import { DailyArticle } from './dailyArticleModel'

export type DailyArticleType = {
	id: number
	title: string
	subtitle: string
	image: string
	contentURL: string
	contentBody: string
	keyWord: string
	category: string
}

export interface IDailyArticleType {
	add(params: DailyArticleType): Promise<DailyArticle>
}

export interface createArticleRequest extends Request {
	DebtType: DailyArticleType
	user: UserType
	file: Express.Multer.File
}
export interface GetByIdRequest extends Request {
	category: string
	user: UserType
}
export interface UpdateArticleRequest extends Request {
	id: number
	DebtType: DailyArticleType
	file: Express.Multer.File
}
export interface DeleteArticleRequest extends Request {
	id: number
}
export const categoryType = {
	NEWS: 'news',
	MUSIC: 'music',
	WISEWORD: 'wise-words'
}
