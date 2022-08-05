import moment from 'moment'
import sequelize, { Op } from 'sequelize'
import { Frequency, Status } from '../api/transaction/interface'
import { Transaction } from '../api/transaction/transactionModel'
import { ScheduleTask } from './ScheduleTask'

const createRecurringTransactions = async (frequency: Frequency): Promise<void> => {
	try {
		let records: Transaction[] = []

		const whereConditions = {
			recurring_status: Status.Active,
			frequency,
			due_date: {
				[Op.lt]: moment().toISOString()
			},
			parent_transaction_id: null
		}

		switch (frequency) {
			case Frequency.Daily:
				records = await Transaction.findAll({
					where: whereConditions
				})

				break

			case Frequency.Weekly:
				records = await Transaction.findAll({
					where: {
						[Op.and]: [
							whereConditions,
							sequelize.where(
								sequelize.fn('DAYNAME', sequelize.col('due_date')),
								'=',
								sequelize.fn('DAYNAME', sequelize.literal('NOW()'))
							)
						]
					}
				})

				break
			case Frequency.Monthly:
				const getDates = (lastDay: number): number[] => {
					const arr: number[] = []
					for (let day = lastDay; day <= 31; day++) {
						arr.push(day)
					}
					return arr
				}

				const day = moment().day()
				const isLastDayOfTheMonth = day === moment().daysInMonth()

				records = await Transaction.findAll({
					where: {
						[Op.and]: [
							whereConditions,
							sequelize.where(sequelize.fn('DAY', sequelize.col('due_date')), {
								[Op.in]: isLastDayOfTheMonth ? getDates(day) : [sequelize.fn('DAY', sequelize.literal('NOW()'))]
							})
						]
					}
				})

				break

			default:
				break
		}

		await Promise.all(
			records.map(async record => {
				const payload = record.get()

				const parentId = payload.id

				delete payload.id
				delete payload.parent_transaction_id
				delete payload.status

				return Transaction.create({
					...payload,
					status: null,
					recurring_status: Status.Active,
					created_at: new Date(),
					due_date: moment().utc().endOf('day'),
					paid_at: null,
					parent_transaction_id: parentId
				})
			})
		)

		console.log(`${records.length} ${frequency} recurring transactions created`)
	} catch (error) {
		console.log(error)
	}
}

const DAILY_CRON = '0 0 * * *'

export const RecurringTransactions = () => {
	const task = new ScheduleTask(DAILY_CRON, async () => {
		await createRecurringTransactions(Frequency.Daily)
		await createRecurringTransactions(Frequency.Weekly)
		await createRecurringTransactions(Frequency.Monthly)
	})

	task.run()
}
