import { Request } from 'express'
import { UserType } from '../user/interface'
import { TransactionAccount } from './transactionAccModel'

export type TransactionAccountType = {
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
	user: UserType
}

export interface CreateTransactionAccountRequest extends Request {
	TransactionAccType: TransactionAccountType
	user: UserType
}

export interface UpdateTransactionAccountRequest extends Request {
	id: number
	TransactionAccType: TransactionAccountType
	user: UserType
}

export interface ITransactionAccountService {
	list(): Promise<TransactionAccount[]>
	fetch(id: number, userId: number): Promise<TransactionAccount[]>
	add(params: TransactionAccountType): Promise<TransactionAccount | null>
	update(id: number, params: TransactionAccountType): Promise<TransactionAccount | null>
}
