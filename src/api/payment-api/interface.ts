export type TransactionRequest = {
	token: string
	amount: number
	userId: number
	deviceData: string
	serviceProviderId: number
	date: string
	startTime: string
	endTime: string
}

export const PaymentStatus = {
	PENDING: 'Pending',
	FAILED: 'Failed',
	SUCCESS: 'Success',
	REFUND: 'Refund'
}
