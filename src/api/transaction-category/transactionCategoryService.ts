import { ITransactionCategoryService, TransactionCategoryType, TransactionCategory } from "./interface";
import { pool } from "../../database";
import { TransactionCategoryModel } from "./transactionCategoryModel";

export class TransactionCategoryService implements ITransactionCategoryService {
    async add (params: TransactionCategory): Promise<TransactionCategoryModel> {
        const transactionCategory = await TransactionCategoryModel.create({ 
            name: params.name, 
            user_id: params.user_id, 
            icon_url: params.icon_url, 
            type: params.type, 
            is_default: params.is_default, 
            status: params.status
        })

        return transactionCategory as TransactionCategoryModel
    }

    async list (): Promise<TransactionCategoryModel[]> {
        const transactionCategories = await TransactionCategoryModel.findAll()
        
        return transactionCategories as TransactionCategoryModel[]
    }

    async fetchByUserId (user_id: number): Promise<TransactionCategoryModel[]> {
        const transactionCategories = await TransactionCategoryModel.findAll({
            where: {
                user_id: user_id
            }
        })

        return transactionCategories as TransactionCategoryModel[]
    }

    async update (id: number, params: TransactionCategory): Promise<Array<any>> {
        const updatedRow = await TransactionCategoryModel.update({
            name: params.name, 
            user_id: params.user_id, 
            icon_url: params.icon_url, 
            type: params.type, 
            is_default: params.is_default, 
            status: params.status
        },
        {
            where: {
                id: id
            }
        })

        return updatedRow
    }

    async delete (id: number): Promise<Object> {
        const deletedRow = await TransactionCategoryModel.destroy({
            where: {
                id: id
            }
        })

        return deletedRow
    }
}
