import { QueryTypes } from 'sequelize'
import { sequelize } from '../../database'
import { TransactionAccount } from '../transaction-account/transactionAccModel'
import { IRecordService, RecordType } from './interface'
import { Record } from './recordModel'

export class RecordService implements IRecordService {
	async list(): Promise<Record[]> {	
		const records = await Record.findAll()
		return records
	}
	
	async listByUserId(userId: number): Promise<Record[]> {	
		const records = await sequelize.query("SELECT * FROM `transaction_history` INNER JOIN `transaction_account` ON transaction_history.account_id = transaction_account.id WHERE user_id=" + userId, { type: QueryTypes.SELECT })
		
		console.log(records)
		return records as Record[]
	}

	async add(params: RecordType, userId: number): Promise<Record> {
		const timestamp = new Date().getTime()

		const accounts = await TransactionAccount.findAll({
			where:{
				user_id: userId,
				id: params.account_id
			}
		})

		if(!accounts.length){
			throw new Error("Unauthorized")
		}

		const record = await Record.create({
			amount: params.amount,
			type: params.type,
			category_id: params.category_id,
			timestamp: timestamp,
			transaction_id: params.transaction_id,
			currency_id: params.currency_id,
			account_id: params.account_id
		})
		return record
	}

	async update(id: number, params: RecordType, userId: number): Promise<Record> {
		const recordOne = await Record.findOne({
			where:{
				id: id
			}
		})
		
		const accounts = await TransactionAccount.findAll({
			where:{
				id: recordOne!.get("account_id"),
				user_id: userId
			}
		})

		if(!accounts.length){
			throw new Error("Unauthorized")
		}

		const record = await Record.update(
			{
				amount: params.amount,
				type: params.type,
				category_id: params.category_id,
				transaction_id: params.transaction_id,
				currency_id: params.currency_id,
			},
			{
				where: {
					id: id
				}
			}
		)

		const updatedRecord = await Record.findOne({
			where:{
				id: id
			}
		})
		return updatedRecord!
	}

	async delete(id: number): Promise<number> {
		const record = await Record.destroy({
			where: {
				id: id
			}
		})
		return record
	}
}
