import { Country } from './countryModel'
import { IWorldService } from './interface'
import { State } from './stateModel'
import { City } from './cityModel'

export class WorldService implements IWorldService {

  constructor () {}

  countries (): Promise<Country[]> {
    return Country.findAll({})
  }

  regions (countryId: string): Promise<State[]> {
    return State.findAll({
      where: {
        country_id: countryId
      }
    })
  }

  cities (regionId: string): Promise<City[]> {
    return City.findAll({
      where: {
        state_id: regionId
      }
    })
  }
}
