import { Request } from "express" 
import { TransactionCategoryModel } from './transactionCategoryModel'

export type TransactionCategory = {
    id: number
    name: string
    user_id: string
    icon_url: string
    type: TransactionCategoryType
    is_default: number
    status: string
}

export enum TransactionCategoryType {
    Expense = "Expense",
    Income = "Income"
}

export interface ITransactionCategoryService {
    list (): Promise<TransactionCategoryModel[]>
    fetchByUserId (user_id: number): Promise<TransactionCategoryModel[]>
    add (params: TransactionCategory): Promise<TransactionCategoryModel>
    update (id: number, params: TransactionCategory): Promise<Array<any>>
    delete (id: number): Promise<Object>
}

export interface CreateTransactionCategoryRequest extends Request {
    TransactionCategory: TransactionCategory
}

export interface GetTransactionCategoriesByUserIdRequest extends Request {
    user_id: number
}

export interface UpdateTransactionCategoryByIdRequest extends Request {
    user_id: number
    TransactionCategory: TransactionCategoryModel
}

export interface DeleteTransactionCategoryRequest extends Request {
    id: number
}
