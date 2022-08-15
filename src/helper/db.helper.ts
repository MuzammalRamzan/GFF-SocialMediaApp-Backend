import { FindAndCountOptions } from 'sequelize/types'

export type PaginationType = { page: number; pageSize: number }

export const paginate = (query: FindAndCountOptions, pagination: PaginationType): FindAndCountOptions => {
	const offset = pagination.page * pagination.pageSize
	const limit = pagination.pageSize

	return {
		...query,
		offset,
		limit
	}
}

export const CREW_MEMBERS_FIELDS = ['status', 'role']

export const CREW_MEMBER_USER_FIELD = ['full_name', 'role_id']

export const USER_INFORMATION_FIELDS = [
	'profile_url',
	'bio',
	'date_of_birth',
	'gender',
	'country',
	'job_role',
	'education'
]

export const USER_ADDITIONAL_INFORMATION_FIELDS = [
	'profile_url',
	'bio',
	'date_of_birth',
	'gender',
	'country',
	'job_role',
	'education',
	'latitude',
	'longitude'
]

export const USER_FIELDS = ['id', 'full_name']

export const WELLNESS_WARRIOR_FIELDS = ['specialty', 'certification', 'therapy_type', 'price_range']

export const MENTOR_FIELDS = ['industry', 'role', 'frequency', 'conversation_mode', 'isPassedIRT', 'languages']

export const PAYMENT_TRANSACTION_FIELDS = ['id', 'status', 'amount', 'transaction_id', 'created_at']

export const USER_DETAILS_FIELDS = [
	'id',
	'role_id',
	'full_name',
	'email',
	'default_currency_id',
	'user_feature_id',
	'deactivated'
]
