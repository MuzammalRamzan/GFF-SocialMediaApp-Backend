import { Request } from 'express'
import { IPromocode, Promocode } from './promocodeModel'
import { PaginationType } from '../../helper/db.helper'
import { IUser } from '../user/userModel'

export type PaginatedPromocodeResult = { rows: Promocode[]; count: number; page?: number; pageSize?: number }

export const Messages = {
	CREATE_PROMOCODE: 'Create Promocode Successfully!',
	UPDATE_PROMOCODE: 'Update Promocode Successfully!',
	DELETE_PROMOCODE: 'Promocode Deleted Successfully!',
	GET_ALL_PROMOCODE: 'Fetch Promocodes Successfully!',
	INVALID_PROMOCODE: 'Invalid Promocode!',
	GET_PROMOCODE: 'Fetch Promocode Successfully!',
	PROMOCODE_NOT_FOUND: 'Promocode not found!',
	PROMOCODE_USED: 'Promocode is used already!',
	PROMOCODE_EXPIRED: 'Promocode is expired!',
	NOT_FOUND: 'No data found',
	PROMOCODE_APPLIED: 'Promocode applied Successfully!',
	UNAUTHORIZED: 'Unauthorized',
	EXPIRY_IN_PAST: "Expiry date should be in future."
}


export interface IPromocodeService {
	createBulkPromocodes(createPromoCodesRequest:CreatePromoCodesRequest): Promise<boolean>
	fetchById(id: number): Promise<Promocode[]>
	list(pagination: PaginationType): Promise<PaginatedPromocodeResult>
	update(id: number, params: IPromocode): Promise<Promocode>
}

export interface CreatePromoCodesRequest extends Request {
	number_of_promocodes: number
	expiry_date: Date,
	duration: number,
}

export interface UpdatePromocodeRequest extends Request {
	Promocode: Partial<IPromocode>
}

export interface DeletePromocodeRequest extends Request {
	id: number
}

export interface UtilizePromocodeRequest extends Request {
	promocode: string,
	user: IUser
}