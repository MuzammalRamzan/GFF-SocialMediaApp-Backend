import { Currency } from "./currencyModel"

export type CurrencyType = {
	id: number
	symbol: string
	name: string
}

export interface ICurrencyService {
    list (): Promise<Currency[]>
    fetchById (id: number): Promise<Currency>
	add (params: CurrencyType): Promise<Currency>
	delete (id: number): Promise<number>
}
