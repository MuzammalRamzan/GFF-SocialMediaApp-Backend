import { WorldService } from './worldService'
import { NextFunction, Request, Response } from 'express'

export class WorldController {
  private worldService: WorldService

  constructor () {
    this.worldService = new WorldService()
  }

  countries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const countries = await this.worldService.countries()
      return res.status(200).json({
        data: countries,
        code: 200,
        message: 'OK'
      })
    } catch (err) {
      next(err)
    }
  }

  regions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const countryId = req.query.countryId as string
      console.log({ countryId })
      const states = await this.worldService.regions(countryId)
      return res.status(200).json({
        data: states,
        code: 200,
        message: 'OK'
      })
    } catch (err) {
      next(err)
    }
  }

  cities = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const regionId = req.query.regionId as string
      const cities = await this.worldService.cities(regionId)
      return res.status(200).json({
        data: cities,
        code: 200,
        message: 'OK'
      })
    } catch (err) {
      next(err)
    }
  }
}
