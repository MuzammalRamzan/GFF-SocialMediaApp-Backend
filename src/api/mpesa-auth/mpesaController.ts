import { NextFunction, Request, Response } from "express"
import { GffError, jsonErrorHandler } from "../helper/errorHandler"
import { MpesaService } from "./mpesaService"


export class MpesaController {
    private readonly mpesaService: MpesaService

    constructor() {
		this.mpesaService = new MpesaService()
	}

    fetch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.mpesaService.mpesaAuth()
            return res.status(200).send({
				data: {
					response
				},
				code: 200,
				message: 'OK'
			})
        } catch (err) {
            const error = err as GffError
				error.errorCode = '500'
				error.httpStatusCode = 500

			return jsonErrorHandler(err, req, res, () => {})
        }
    }

}