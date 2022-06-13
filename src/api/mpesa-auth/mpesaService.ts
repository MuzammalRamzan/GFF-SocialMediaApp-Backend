import { IMpesaService, MpesaType } from "./interface"
import axios from 'axios';

export class MpesaService implements IMpesaService{

    async mpesaAuth(): Promise<MpesaType> {

		const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

		const { data } = await axios.get(url, {
			headers: {
				'Authorization': `Basic ${process.env.MPESA_AUTHORIZATION}`
			}
		})

		return data as MpesaType
	}
}