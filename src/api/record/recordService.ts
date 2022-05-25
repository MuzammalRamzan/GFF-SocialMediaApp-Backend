import { IRecordService, RecordParams } from './interface'
import { RecordModel } from './recordModel'

export class RecordService implements IRecordService {
	async list(): Promise<RecordModel[]> {
		const records = await RecordModel.findAll()
		return records as RecordModel[]
	}
	async add(params: RecordParams): Promise<RecordModel> {
		const record = await RecordModel.create({
			amount: params.amount,
			type: params.type,
			category_id: params.category_id,
			timestamp: params.timestamp,
			transaction_id: params.transaction_id,
			currency_id: params.currency_id,
			account_id: params.account_id
		})
		return record as RecordModel
	}
	async update(id: number, params: RecordParams): Promise<number> {
		const updatedRecord = await RecordModel.update(
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
		const deleteRecord = await RecordModel.destroy({
			where: {
				id: id
			}
		})
		return deleteRecord as number
	}
}
