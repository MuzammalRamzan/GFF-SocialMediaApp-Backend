export type ApplyForLoanType = {
	phone_confirmed: boolean
	yoti_verification_passed: boolean
	is_premium: boolean
	has_crew: boolean
	is_crew_valid: boolean
	has_bb: boolean
	is_bb_valid: boolean
	is_country_valid: boolean
}

export type ApplyForLoanCreateType = {
	amount: number
	years: number
}
