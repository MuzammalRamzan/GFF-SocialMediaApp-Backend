import { Request, Response, NextFunction } from 'express'
import { DebtService } from './debtService'
import { CreateDebtRequest, 
         DeleteDebtRequest, 
         GetByIdRequest, 
         GetDueDateByDebtIdRequest, 
         UpdateDebtRequest } from './interface'

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

    getById = async (req: GetByIdRequest, res: Response, next: NextFunction) => {
        const id = +req.params.id
		const userId = +req.user.id

        try {
            const debt = await this.debtService.fetchById(id, userId)
            res.status(200).send(debt)
        } catch (err) {
            throw err
        }
    }

    getDueDateByDebtId = async (req: GetDueDateByDebtIdRequest, res: Response, next: NextFunction) => {
        const id = +req.params.id
		const userId = +req.user.id
        try {
            const dueDate = await this.debtService.fetchDueDateById(id, userId)
            res.status(200).send(dueDate)
        } catch (err) {
            throw err
        }
    }

	createDebt = async (req: CreateDebtRequest, res: Response, next: NextFunction) => {
		const user_id = +req.user.id
		const params = {...req.body, user_id}

		try {
			const debt = await this.debtService.add(params)
			res.status(200).send(debt)
		} catch (err) {
			throw err
		}
	}

	updateDebt = async (req: UpdateDebtRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const user_id = +req.user.id
		const params = {...req.body, user_id}
		try {
			const debt = await this.debtService.update(id, params)
			res.status(200).send({ debt })
		} catch (err) {
			throw err
		}
	}

	deleteDebt = async (req: DeleteDebtRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const userId = +req.user.id
		try {
			const debt = await this.debtService.delete(id, userId)
			res.status(200).send({ debt })
		} catch (err) {
			throw err
		}
	}
}