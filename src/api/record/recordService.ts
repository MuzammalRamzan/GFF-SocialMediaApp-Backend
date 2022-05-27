import { IRecordService, RecordType } from './interface'
import { Record } from './recordModel'

export class RecordService implements IRecordService {
	async list(): Promise<Record[]> {
		const records = await Record.findAll()
		return records
	}

	async add(params: RecordType): Promise<Record> {
		const timestamp = new Date().getTime()

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

	async update(id: number, params: RecordType): Promise<[affectedCount: number]> {
		const record = await Record.update(
			{
				amount: params.amount,
				type: params.type,
				category_id: params.category_id,
				transaction_id: params.transaction_id,
				currency_id: params.currency_id,
				account_id: params.account_id
			},
			{
				where: {
					id: id
				}
			}
		)
		return record
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
