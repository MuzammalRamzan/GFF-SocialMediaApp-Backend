import { Request } from 'express'
import { UserType } from '../user/interface'
import { Transaction } from './transactionModel'

export type TransactionType = {
	id: number
	frequency: Frequency
	user_id: number
	account_id: number
	category_id: number
	status: Status
}

export enum Status {
	Active = 'Active',
	Inactive = 'Inactive',
	Deleted = 'Deleted'
}

export enum Frequency {
	Daily = 'Daily',
	Weekly = 'Weekly',
	Monthly = 'Monthly',
	Never = 'Never'
}

export interface CreateTransactionRequest extends Request {
	TransactionParams: TransactionType
	user: UserType
}

export interface UpdateTransactionRequest extends Request {
	id: number
	TransactionParams: TransactionType
	user: UserType
}

export interface DeleteTransactionRequest extends Request {
	id: number
	user: UserType
}

export interface ITransactionService {
	list(): Promise<Transaction[]>
	add(params: TransactionType): Promise<Transaction>
	update(id: number, params: TransactionType): Promise<Transaction>
	delete(id: number, user_id: number): Promise<number>
}
