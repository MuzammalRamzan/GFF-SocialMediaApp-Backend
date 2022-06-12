import { Request } from 'express'
import { UserType } from '../user/interface'
import { Debt } from './debtModel'

export type DebtType = {
	id: number
	amount: number
	due_date: Date
	user_id: number
}

export interface IDebtService {
	list(): Promise<Debt[]>
    fetchById (id: number, userId: number): Promise<Debt>
    fetchDueDateById(id: number, userId: number): Promise<Date>
	add(params: DebtType): Promise<Debt>
	update(id: number, params: DebtType): Promise<Debt>
	delete(id: number, user_id: number): Promise<number>
}

export interface GetByIdRequest extends Request {
    id: number
    user: UserType
}

export interface GetDueDateByDebtIdRequest extends Request {
    id: number
    user: UserType
}

export interface CreateDebtRequest extends Request {
    DebtType: DebtType
    user: UserType
}

export interface UpdateDebtRequest extends Request {
    id: number
    DebtType: DebtType
    user: UserType
}

export interface DeleteDebtRequest extends Request {
    id: number
    user: UserType
}