import { Request, Response, NextFunction } from 'express';
import { TransactionAccountParams } from './interface';
import { TransactionAccService } from "./transactionAccService";

export class TransactionAccController {
    private readonly transactionAccService: TransactionAccService

    constructor () {
        this.transactionAccService = new TransactionAccService()
    }

    getAllTransactionAccounts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const transactionAcc = await this.transactionAccService.list()
            res.send(transactionAcc)
        } catch (err) {
            throw err
        }
    }

    getTransactionAccountById = async (req: Request, res: Response, next: NextFunction) => {
        const id = +!req.query.id

        try {
            const transactionAcc = await this.transactionAccService.fetch(id)
            res.send(transactionAcc)
        } catch (err) {
            throw err
        }
    }

    createTransactionAccount = async (req: Request, res: Response, next: NextFunction) => {
        const params = req.query.params

        try {
            const transactionAcc = await this.transactionAccService.add(params as unknown as TransactionAccountParams)
            res.send(transactionAcc)
        } catch (err) {
            throw err
        }
    }
}
