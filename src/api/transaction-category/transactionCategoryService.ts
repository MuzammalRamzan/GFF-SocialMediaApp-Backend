import { ITransactionCategoryService, TransactionCategoryType } from "./interface";
import { TransactionCategory } from "./transactionCategoryModel";

export class TransactionCategoryService implements ITransactionCategoryService {
    async add (params: TransactionCategoryType): Promise<TransactionCategory> {
        const transactionCategory = await TransactionCategory.create({ 
            name: params.name, 
            user_id: params.user_id, 
            icon_url: params.icon_url, 
            colour: params.colour,
            type: params.type, 
            is_default: params.is_default, 
            status: params.status
        })

        return transactionCategory as TransactionCategory
    }

    async list (): Promise<TransactionCategory[]> {
        const transactionCategories = await TransactionCategory.findAll()
        
        return transactionCategories as TransactionCategory[]
    }

    async fetchByUserId (user_id: number): Promise<TransactionCategory[]> {
        const transactionCategories = await TransactionCategory.findAll({
            where: {
                user_id: user_id
            }
        })

        return transactionCategories as TransactionCategory[]
    }

    async update (id: number, params: TransactionCategoryType): Promise<[affectedCount: number]> {
        const updatedRow = await TransactionCategory.update({
            name: params.name, 
            user_id: params.user_id, 
            icon_url: params.icon_url,
            colour: params.colour,
            type: params.type, 
            is_default: params.is_default, 
            status: params.status
        },
        {
            where: {
                id: id,
                user_id: params.user_id
            }
        })

        return updatedRow
    }

    async delete (id: number, userId: number): Promise<number> {
        const deletedRow = await TransactionCategory.destroy({
            where: {
                id: id,
                user_id: userId
            }
        })

        return deletedRow
    }
}
