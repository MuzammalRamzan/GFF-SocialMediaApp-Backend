import { Request } from 'express'
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
}

export interface UpdateRecordRequest extends Request {
	id: number
	RecordParams: RecordType
}

export interface DeleteRecordRequest extends Request {
	id: number
}

export interface IRecordService {
	list(): Promise<Record[]>
	add(params: RecordType): Promise<Record>
	update(id: number, params: RecordType): Promise<[affectedCount: number]>
	delete(id: number): Promise<number>
}
