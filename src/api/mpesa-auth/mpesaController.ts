import { NextFunction, Request, Response } from "express"
import { MpesaService } from "./mpesaService"


export class MpesaController {
    private readonly mpesaService: MpesaService

    constructor() {
		this.mpesaService = new MpesaService()
	}

    fetch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.mpesaService.mpesaAuth()
            res.status(200).send(response)
        } catch (err) {
            throw err
        }
    }

}