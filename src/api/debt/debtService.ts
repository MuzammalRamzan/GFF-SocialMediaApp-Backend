import { IDebtService, DebtType } from "./interface";
import { Debt } from "./debtModel";

export class DebtService implements IDebtService {

    async list (): Promise<Debt[]> {
        const debts = await Debt.findAll()
        
        return debts
    }

    async fetchById (id: number, userId: number): Promise<Debt> {
        const debt = await Debt.findOne({
            where: {
                id: id,
                user_id: userId
            }
        })

        if (!debt){
            throw new Error("Unauthorized")
        }

        return debt as Debt
    }

    async fetchDueDateById (id: number, userId: number): Promise<Date> {
        const debt = await Debt.findOne({
            where: {
                id: id,
                user_id: userId
            }
        })

        if(!debt){
            throw new Error("Unauthorized")
        }

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

    async update (id: number, params: DebtType): Promise<Debt> {
        const updatedRow = await Debt.update({
            amount: params.amount,
            due_date: params.due_date,
            user_id: params.user_id
        },
        {
            where: {
                id: id,
                user_id: params.user_id
            }
        })
        if (updatedRow[0] === 1){
			const updatedRow = await Debt.findByPk(id)
			return updatedRow as Debt

		}

		throw new Error("Unauthorized")

    }

    async delete (id: number, userId: number): Promise<number> {
        const deletedRow = await Debt.destroy({
            where: {
                id: id,
                user_id: userId
            }
        })
        if(!deletedRow){
            throw new Error("Unauthorized")
        }

        return deletedRow
    }
}