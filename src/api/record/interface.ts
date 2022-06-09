import { Request } from 'express'
import { UserType } from '../user/interface'
import { Record } from './recordModel'

export type RecordType = {
	id: number
	amount: number
	type: RecordEnum
	category_id: number
	timestamp: Date
	transaction_id: number
	currency_id: number
	account_id: number
}

export enum RecordEnum {
	Expense = 'Expense',
	Income = 'Income'
}

export interface CreateRecordRequest extends Request {
	RecordParams: RecordType
	user: UserType
}

export interface UpdateRecordRequest extends Request {
	id: number
	RecordParams: RecordType
	user: UserType
}

export interface DeleteRecordRequest extends Request {
	id: number
}

export interface GetAllRecordsByUserIdRequest extends Request {
	user: UserType
}

export interface IRecordService {
	list(): Promise<Record[]>
	add(params: RecordType, userId: number): Promise<Record>
	update(id: number, params: RecordType, userId: number): Promise<Record>
	// delete(id: number): Promise<number>
}
