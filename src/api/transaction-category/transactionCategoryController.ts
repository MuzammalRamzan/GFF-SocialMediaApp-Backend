import { Request, Response, NextFunction } from 'express';
import { CreateTransactionCategoryRequest, 
         DeleteTransactionCategoryRequest, 
         GetTransactionCategoriesByUserIdRequest, 
         UpdateTransactionCategoryByIdRequest} from './interface';
import { TransactionCategoryService } from "./transactionCategoryService";

export class TransactionCategotryController {
    private readonly transactionCategoryService: TransactionCategoryService

    constructor () {
        this.transactionCategoryService = new TransactionCategoryService()
    }

    createTransactionCategory = async (req: CreateTransactionCategoryRequest, res: Response, next: NextFunction) => {
        const params = req.body
        try {
            const transactionCategory = await this.transactionCategoryService.add(params)
            res.send(transactionCategory)
        } catch (err) {
            throw err
        }
    }

    getAllTransactionCategories = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const transactionCategories = await this.transactionCategoryService.list()
            res.send(transactionCategories)
        } catch (err) {
            throw err
        }
    }

    getTransactionCategoriesByUserId = async (req: GetTransactionCategoriesByUserIdRequest, res: Response, next: NextFunction) => {
        const userId = +req.params.user_id
        try {
            const transactionCategories = await this.transactionCategoryService.fetchByUserId(userId)
            res.send(transactionCategories)
        } catch (err) {
            throw err
        }
    }

    updateTransactionCategoryById = async (req: UpdateTransactionCategoryByIdRequest, res: Response, next: NextFunction) => {
        const id = +req.params.id
        const params = req.body
        try {
            const transactionCategory = await this.transactionCategoryService.update(id, params)
            res.send(transactionCategory)
        } catch (err) {
            throw err
        }
    }

    deleteTransactionCategory = async (req: DeleteTransactionCategoryRequest, res: Response, next: NextFunction) => {
        const id = +req.params.id
        try {
            const transactionCategory = await this.transactionCategoryService.delete(id)
            res.send({transactionCategory})
        } catch (err) {
            throw err
        }
    }
}
