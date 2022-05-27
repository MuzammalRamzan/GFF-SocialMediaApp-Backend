import { Request, Response, NextFunction } from 'express'
import { DebtService } from './debtService'

export class DebtController {
	private readonly debtService: DebtService

	constructor() {
		this.debtService = new DebtService()
	}

	getAllDebts = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const debts = await this.debtService.list()
			res.status(200).send(debts)
		} catch (err) {
			throw err
		}
	}

    getById = async (req: Request, res: Response, next: NextFunction) => {
        const id = +req.params.id

        try {
            const debt = await this.debtService.fetchById(id)
            res.status(200).send(debt)
        } catch (err) {
            throw err
        }
    }

    getDueDateByDebtId = async (req: Request, res: Response, next: NextFunction) => {
        const id = +req.params.id
        try {
            const dueDate = await this.debtService.fetchDueDateById(id)
            res.status(200).send(dueDate)
        } catch (err) {
            throw err
        }
    }

	createDebt = async (req: Request, res: Response, next: NextFunction) => {
		const params = req.body

		try {
			const debt = await this.debtService.add(params)
			res.status(200).send(debt)
		} catch (err) {
			throw err
		}
	}

	updateDebt = async (req: Request, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const params = req.body
		try {
			const debt = await this.debtService.update(id, params)
			res.status(200).send({ debt })
		} catch (err) {
			throw err
		}
	}

	deleteDebt = async (req: Request, res: Response, next: NextFunction) => {
		const id = +req.params.id
		try {
			const debt = await this.debtService.delete(id)
			res.status(200).send({ debt })
		} catch (err) {
			throw err
		}
	}
}