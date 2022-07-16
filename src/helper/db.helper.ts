import { FindAndCountOptions } from 'sequelize/types'

export type PaginationType = { page: number; pageSize: number }

export const paginate = (query: FindAndCountOptions, pagination: PaginationType): FindAndCountOptions => {
	const offset = (pagination.page - 1) * pagination.pageSize
	const limit = pagination.pageSize

	return {
		...query,
		offset,
		limit
	}
}

export const USER_INFORMATION_FIELDS = [
	'profile_url',
	'bio',
	'date_of_birth',
	'gender',
	'country',
	'job_role',
	'education'
]

export const USER_FIELDS = ['id', 'full_name']

export const WELLNESS_WARRIOR_FIELDS = ['specialty', 'certification', 'therapy_type', 'price_range']
