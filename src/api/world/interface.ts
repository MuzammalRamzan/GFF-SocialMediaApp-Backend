import { Country } from './countryModel'
import { State } from './stateModel'
import { City } from './cityModel'

// export type PaginatedUserResult = { rows: UserFCMTokens[]; count: number; page?: number; pageSize?: number }

export const Messages = {
	TOKEN_EXISTS: 'Token already exists!',
	TOKEN_NOT_FOUND: 'Token not found!',
	TOKEN_DELETED: 'Token deleted successfully!',
}

export interface IWorldService {
	countries(): Promise<Country[]>
	regions(countryId: string): Promise<State[]>
	cities(regionId: string): Promise<City[]>
}

