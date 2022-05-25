import { Request } from 'express'
import { RecordModel } from './recordModel'

export type RecordParams = {
	id: number
	amount: number
	type: RecordType
	category_id: number
	timestamp: Date
	transaction_id: number
	currency_id: number
	account_id: number
}
export enum RecordType {
	Expense = 'Expense',
	Income = 'Income'
}

export interface CreateRecordRequest extends Request {
	RecordParams: RecordParams
}
export interface UpdateRecordRequest extends Request {
	id: number
	RecordParams: RecordParams
}
export interface DeleteRecordRequest extends Request {
	id: number
}

export interface IRecordService {
	list(): Promise<RecordModel[]>
	add(params: RecordParams): Promise<RecordModel>
	update(id: number, params: RecordParams): Promise<number>
	delete(id: number): Promise<number>
}
