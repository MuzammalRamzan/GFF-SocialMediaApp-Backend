import { Request } from "express" 

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
    list (): Promise<TransactionCategory[]>
    fetchByUserId (user_id: number): Promise<TransactionCategory[]>
    add (params: TransactionCategory): Promise<TransactionCategory[]>
    update (id: number, params: TransactionCategory): Promise<TransactionCategory[]>
    delete (id: number): Promise<TransactionCategory[]>
}

export interface CreateTransactionCategoryRequest extends Request {
    TransactionCategory: TransactionCategory
}

export interface GetTransactionCategoriesByUserIdRequest extends Request {
    user_id: number
}

export interface UpdateTransactionCategoryByIdRequest extends Request {
    user_id: number
    TransactionCategory: TransactionCategory
}

export interface DeleteTransactionCategoryRequest extends Request {
    id: number
}
