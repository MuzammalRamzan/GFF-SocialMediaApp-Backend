import { Currency } from "./currencyModel";
import { CurrencyType, ICurrencyService } from "./interface";

export class CurrencyService implements ICurrencyService {
    async list (): Promise<Currency[]> {
        const result = await Currency.findAll()

        return result
    }

    async fetchById (id: number): Promise<Currency> {
        const result = await Currency.findOne({
            where: {
                id
            }
        })

        if (!result) {
            throw new Error('There is no currency with given ID')
        }

        return result
    }

    async add (params: CurrencyType): Promise<Currency> {
        const result = await Currency.create({
            symbol: params.symbol,
            name: params.name,
        })

        return result
    }

    async delete (id: number): Promise<number> {
        const result = await Currency.destroy({
            where: {
                id
            }
        })

        return result
    }
}
