import { Request } from "express" 
import { UserType } from "../user/interface"
import { TransactionCategory } from './transactionCategoryModel'

export type TransactionCategoryType = {
    id: number
    name: string
    user_id: string
    icon_url: string
    colour: string
    type: TransactionCategoryTypeEnum
    is_default: number
    status: string
}

export enum TransactionCategoryTypeEnum {
    Expense = "Expense",
    Income = "Income"
}

export interface ITransactionCategoryService {
    list (): Promise<TransactionCategory[]>
    fetchByUserId (user_id: number): Promise<TransactionCategory[]>
    add (params: TransactionCategoryType): Promise<TransactionCategory>
    update (id: number, params: TransactionCategoryType): Promise<[affectedCount: number]>
    delete (id: number, user_id: number): Promise<number>
}

export interface CreateTransactionCategoryRequest extends Request {
    TransactionCategory: TransactionCategory,
    user: UserType
}

export interface GetTransactionCategoriesByUserIdRequest extends Request {
    user: UserType
}

export interface UpdateTransactionCategoryByIdRequest extends Request {
    user: UserType
    TransactionCategory: TransactionCategory
}

export interface DeleteTransactionCategoryRequest extends Request {
    id: number,
    user: UserType
}
