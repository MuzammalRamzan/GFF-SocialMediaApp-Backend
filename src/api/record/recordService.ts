import { IRecordService, RecordType } from './interface'
import { Record } from './recordModel'

export class RecordService implements IRecordService {
	async list(): Promise<Record[]> {
		const records = await Record.findAll()
		return records as Record[]
	}

	async add(params: RecordType): Promise<Record> {
		const record = await Record.create({
			amount: params.amount,
			type: params.type,
			category_id: params.category_id,
			timestamp: params.timestamp,
			transaction_id: params.transaction_id,
			currency_id: params.currency_id,
			account_id: params.account_id
		})
		return record as Record
	}

	async update(id: number, params: RecordType): Promise<number> {
		const updatedRecord = await Record.update(
			{
				amount: params.amount,
				type: params.type,
				category_id: params.category_id,
				timestamp: params.timestamp,
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
		return updatedRecord as unknown as number
	}

	async delete(id: number): Promise<number> {
		const deleteRecord = await Record.destroy({
			where: {
				id: id
			}
		})
		return deleteRecord as number
	}
}
