import { Request, Response, NextFunction } from 'express'
import { CurrencyService } from './currencyService'

export class CurrencyController {
    private readonly currencyService: CurrencyService

    constructor () {
        this.currencyService = new CurrencyService()
    }
    
    fetchAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.currencyService.list()
    
            return res.status(200).send({
                data: {
                    result
                },
                code: 200,
                message: 'OK'
            })
        } catch (err) {
            next(err)
        }
    }

    fetchById = async (req: Request, res: Response, next: NextFunction) => {
        const id = +req.params.id

        try {
            const result = await this.currencyService.fetchById(id)

            return res.status(200).send({
                data: {
                    result
                },
                code: 200,
                message: 'OK'
            })
        } catch (err) {
            next(err)
        }
    }

    addCurrency = async (req: Request, res: Response, next: NextFunction) => {
        const params = { ...req.body }
        
        try {
            const result = await this.currencyService.add(params)

            return res.status(200).send({
                data: {
                    result
                },
                code: 200,
                message: 'OK'
            })
        } catch (err) {
            next(err)
        }
    }

    deleteCurrency = async (req: Request, res: Response, next: NextFunction) => {
        const id = +req.params.id
        try {
            const result = await this.currencyService.delete(id)

            return res.status(200).send({
                data: {
                    result
                },
                code: 200,
                message: 'OK'
            })
        } catch (err) {
            next(err)
        }
    }
}
