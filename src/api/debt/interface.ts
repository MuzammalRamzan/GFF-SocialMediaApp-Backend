import { Request } from 'express'
import { Debt } from './debtModel'

export type DebtType = {
	id: number
	amount: number
	due_date: Date
	user_id: number
}

export interface IDebtService {
	list(): Promise<Debt[]>
    fetchById (id: number): Promise<Debt>
    fetchDueDateById(id: number): Promise<Date>
	add(params: DebtType): Promise<Debt>
	update(id: number, params: DebtType): Promise<[affectedCount: number]>
	delete(id: number): Promise<number>
}

export interface GetByIdRequest extends Request {
    id: number
}

export interface GetDueDateByDebtIdRequest extends Request {
    id: number
}

export interface CreateDebtRequest extends Request {
    DebtType: DebtType
}

export interface UpdateDebtRequest extends Request {
    id: number
    DebtType: DebtType
}

export interface DeleteDebtRequest extends Request {
    id: number
}