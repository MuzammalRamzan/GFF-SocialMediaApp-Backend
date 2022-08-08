import { CreatePromoCodesRequest, IPromocodeService, PaginatedPromocodeResult } from './interface'
import { IPromocode, Promocode } from './promocodeModel'
import short from 'short-uuid'
import { paginate, PaginationType } from '../../helper/db.helper'
import { PaginatedUserResult } from '../user/interface'

export class PromocodeService implements IPromocodeService {

	constructor() {
	}

	async createBulkPromocodes(request: CreatePromoCodesRequest): Promise<boolean> {

		new Array(request.number_of_promocodes).fill(0).map(item =>
			Promocode.create({
				promo_code: short().generate().substr(0, 10).toUpperCase(),
				expiration_date: new Date(request.expiry_date),
				status: 'NOT_USED',
				issue_date: new Date(),
				duration: request.duration
			} as Partial<IPromocode>)
		)

		return true
	}


	async fetchById(id: number): Promise<Promocode[]> {
		return await Promocode.findAll({
			where: {
				id
			}
		})
	}

	async fetchByPromocode(promocode: string): Promise<Promocode|null> {
		return Promocode.findOne({
			where: {
				promo_code: promocode
			}
		})
	}

	async list(pagination: PaginationType): Promise<PaginatedPromocodeResult> {
		const promocode = (await Promocode.findAndCountAll(
			paginate({}, pagination)
		)) as PaginatedUserResult

		promocode.rows = promocode.rows.map(promocode => promocode.toJSON())

		promocode.page = +pagination.page
		promocode.pageSize = +pagination.pageSize
		return promocode
	}

	async update(id: number, params: Partial<IPromocode>): Promise<Promocode> {

		const promocode = await Promocode.findOne({
			where: {
				id
			}
		})

		if (promocode) {
			delete params.id;
			delete params.issue_date;
			await promocode.update(params as Partial<IPromocode>)
		}

		return promocode as Promocode
	}

	async delete(id: number): Promise<number> {
		return await Promocode.destroy({
			where: {
				id
			}
		})
	}
}
