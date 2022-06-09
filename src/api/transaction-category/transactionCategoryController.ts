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
        const user_id = req.user.id
        const params = {...req.body, user_id}
        try {
            const transactionCategory = await this.transactionCategoryService.add(params)
            res.status(200).send(transactionCategory)
        } catch (err) {
            throw err
        }
    }

    getAllTransactionCategories = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const transactionCategories = await this.transactionCategoryService.list()
            res.status(200).send(transactionCategories)
        } catch (err) {
            throw err
        }
    }

    getTransactionCategoriesByUserId = async (req: GetTransactionCategoriesByUserIdRequest, res: Response, next: NextFunction) => {
        const userId = +req.user.id
        try {
            const transactionCategories = await this.transactionCategoryService.fetchByUserId(userId)
            res.status(200).send(transactionCategories)
        } catch (err) {
            throw err
        }
    }

    updateTransactionCategoryById = async (req: UpdateTransactionCategoryByIdRequest, res: Response, next: NextFunction) => {
        const user_id = +req.user.id
        const id = +req.params.id
        const params = {...req.body, user_id}
        try {
            const transactionCategory = await this.transactionCategoryService.update(id, params)
            res.send(transactionCategory)
        } catch (err) {
            throw err
        }
    }

    deleteTransactionCategory = async (req: DeleteTransactionCategoryRequest, res: Response, next: NextFunction) => {
        const userId = +req.user.id
        const id = +req.params.id
        try {
            const transactionCategory = await this.transactionCategoryService.delete(id, userId)
            res.status(200).send({transactionCategory})
        } catch (err) {
            throw err
        }
    }
}
