import moment from 'moment'
import { PAYMENT_TRANSACTION_FIELDS, USER_DETAILS_FIELDS } from '../../helper/db.helper'

import { Transaction } from '../transaction/transactionModel'
import { UserInformation } from '../user-information/userInformationModel'
import { User } from '../user/userModel'
import { WellnessWarriorSession } from '../wellness-warrior-session/wellnessWarriorSessionModel'
import { WellnessWarrior } from '../wellness-warrior/wellnessWarriorModel'
import { PaymentStatus, TransactionRequest } from './interface'
import { paymentTransaction } from './paymentTransactionModel'

const brainTree = require('braintree')

const gateway = new brainTree.BraintreeGateway({
	environment: brainTree.Environment.Sandbox,
	merchantId: process.env.BRAINTREE_MERCHANT_ID,
	publicKey: process.env.BRAINTREE_PUBLIC_KEY,
	privateKey: process.env.BRAINTREE_PRIVATE_KEY
})

export class PaymentService {
	async create(requestObj: TransactionRequest) {
		const { token, amount, userId, deviceData, serviceProviderId, date, startTime, endTime } = requestObj

		const user = await User.findOne({ where: { id: userId } })
		const userInfo = await UserInformation.findOne({ where: { user_id: userId } })

		let braintree_customer_id = userInfo?.getDataValue('braintree_customer_id')

		let customer
		if (braintree_customer_id) {
			try {
				customer = await gateway.customer.find(braintree_customer_id)
			} catch (err) {
				console.log(err)
			}
		}

		if (!customer) {
			try {
				const createCustomer = await gateway.customer.create({
					firstName: user?.getDataValue('full_name')?.split(' ')[0],
					lastName: user?.getDataValue('full_name')?.split(' ')[1],
					company: 'Braintree',
					email: user?.getDataValue('email'),
					phone: userInfo?.getDataValue('phone_number')
				})

				console.log(createCustomer)
				const input = {
					braintree_customer_id: createCustomer?.customer?.id
				}

				await UserInformation.update(input, { where: { user_id: userId } })
			} catch (err) {
				console.log(err)
			}
		}

		return gateway.transaction
			.sale({
				amount: amount,
				paymentMethodNonce: token,
				deviceData,
				customerId: braintree_customer_id,
				options: {
					submitForSettlement: true
				}
			})
			.then(async (result: { message: any; success: any; transaction: { id: string } }) => {
				if (result.success) {
					const createPaymentTransaction = await paymentTransaction.create({
						status: PaymentStatus.SUCCESS,
						amount: amount,
						buyer_id: userId,
						service_provider_id: serviceProviderId,
						// session_id: 1, // Future
						transaction_id: result?.transaction?.id,
						transaction_data: JSON.stringify(result?.transaction),
						created_at: moment().format()
					})

					const wellnessWarriorId = await WellnessWarrior.findOne({ where: { user_id: serviceProviderId } })

					if (wellnessWarriorId) {
						await WellnessWarriorSession.create({
							user_id: userId,
							wellness_warrior_id: wellnessWarriorId?.getDataValue('id') || null,
							date: date,
							start_time: startTime,
							end_time: endTime,
							price: amount,
							transaction_id: createPaymentTransaction.id
						})
					}
					return { message: 'Transaction Successfully!' }
				} else {
					return result.message
				}
			})
			.catch((err: any) => {
				console.log(err)
				if (err) {
					return { error: 'Something went wrong!' }
				}
			})
	}

	async list(userId: number) {
		return paymentTransaction.findAll({
			where: { buyer_id: userId },
			attributes: PAYMENT_TRANSACTION_FIELDS,
			include: [
				{
					model: User,
					as: 'service_provider',
					attributes: USER_DETAILS_FIELDS
				}
			],
			order: [['created_at', 'DESC']]
		})
	}
}
