import { IDebtService, DebtType } from "./interface";
import { Debt } from "./debtModel";

export class DebtService implements IDebtService {

    async list (): Promise<Debt[]> {
        const debts = await Debt.findAll()
        
        return debts
    }

    async fetchById (id: number): Promise<Debt> {
        const debt = await Debt.findOne({
            where: {
                id: id
            }
        })

        return debt as Debt
    }

    async fetchDueDateById (id: number): Promise<Date> {
        const debt = await Debt.findOne({
            where: {
                id:id
            }
        })
        const dueDate = debt!.get("due_date")

        return dueDate as Date
    }

    async add(params: DebtType): Promise<Debt> {
		const debt = await Debt.create({
			amount: params.amount,
            due_date: params.due_date,
            user_id: params.user_id
		})

		return debt
	}

    async update (id: number, params: DebtType): Promise<[affectedCount: number]> {
        const updatedRow = await Debt.update({
            amount: params.amount,
            due_date: params.due_date,
            user_id: params.user_id
        },
        {
            where: {
                id: id
            }
        })

        return updatedRow
    }

    async delete (id: number): Promise<number> {
        const deletedRow = await Debt.destroy({
            where: {
                id: id
            }
        })

        return deletedRow
    }
}