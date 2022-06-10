import { Request } from "express"
import { UserType } from "../user/interface"

export type MpesaType = {
	access_token: string
	expiry_in: string
}

export interface IMpesaService {
	mpesaAuth(): Promise<MpesaType>
}

export interface FetchRequest extends Request {
	user: UserType
}