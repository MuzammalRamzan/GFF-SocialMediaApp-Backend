import { Request } from 'express'
import { TransactionAcc } from './transactionAccModel'

export type TransactionAccType = {
	id: number
	account_type_id: number
	balance: number
	name: string
	country: string
	bank_name: string
	card_owner: string
	card_number: string
	card_expiration_date: Date
	card_cvc: string
	currency_id: number
	user_id: number
	status: Status
}

export enum Status {
	Active = 'Active',
	Inactive = 'Inactive',
	Deleted = 'Deleted'
}

export interface GetTransactionAccountByIdRequest extends Request {
	id: number
}

export interface CreateTransactionAccountRequest extends Request {
	TransactionAccType: TransactionAccType
}

export interface UpdateTransactionAccountRequest extends Request {
	id: number
	TransactionAccType: TransactionAccType
}

export interface ITransactionAccount {
	list(): Promise<TransactionAcc[]>
	fetch(id: number): Promise<TransactionAcc[]>
	add(params: TransactionAccType): Promise<TransactionAcc>
	update(id: number, params: TransactionAccType): Promise<number>
}
