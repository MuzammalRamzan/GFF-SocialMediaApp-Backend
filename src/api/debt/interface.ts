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
