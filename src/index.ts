import Express from 'express'
import multer from 'multer'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '../swagger.json'
import { authRouter } from './api/auth/authRouter'
import { userRouter } from './api/user/userRouter'
import { transactionRouter } from './api/transaction/transactionRouter'
import { transactionAccRouter } from './api/transaction-account/transactionAccRouter'
import { transactionCategoryRouter } from './api/transaction-category/transactionCategoryRouter'
import { recordRouter } from './api/record/recordRouter'
import { findFriendRouter } from './api/find-friend/findFriendRouter'
import { sequelize } from './database'
import { userInformationRouter } from './api/user-information/userInformationRouter'
import { hashtagRouter } from './api/hashtag/hashtagRouter'
import { debtRouter } from './api/debt/debtRouter'
import { loanLedgerProfessionalInformationRouter } from './api/loan-ledger-professional-information/professionalInformationRouter'
import { loanLedgerPersonalInfoRouter } from './api/loan-ledger-personal-information/loanLedgerPersonalInformationRouter'
import { mentorMatcherRouter } from './api/mentor-matcher/mentorMatcherRouter'
import { mentorInformationRouter } from './api/mentor-information/mentorInformationRouter'
import { mpesaRouter } from './api/mpesa-auth/mpesaRouter'
import { warriorInformationRouter } from './api/warrior-information/warriorInformationRouter'
import { warriorRouter } from './api/wellness-warrior/wellnessWarriorRouter'
import { mentorSettingsRouter } from './api/mentor-settings/settingsRouter'
import { currencyRouter } from './api/currency/currencyRouter'
import { uploadRouter } from './api/upload/uploadRouter'

const options = {
	swaggerOptions: {
		filter: true
	}
}

const storage = multer.memoryStorage()

export const upload = multer({
	storage,
	limits: { fileSize: 1000000000 }
})
;(async function main(): Promise<void> {
	const app = Express()

	app.use(bodyParser.json())
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options))
	app.use('/auth', authRouter)
	app.use('/user', userRouter)
	app.use('/transaction', transactionRouter)
	app.use('/transactionAccount', transactionAccRouter)
	app.use('/transactionCategory', transactionCategoryRouter)
	app.use('/record', recordRouter)
	app.use('/find-friend', findFriendRouter)
	app.use('/userInformation', userInformationRouter)
	app.use('/hashtag', hashtagRouter)
	app.use('/debt', debtRouter)
	app.use('/loanLedgerProfessionalInformation', loanLedgerProfessionalInformationRouter)
	app.use('/loanLedgerPersonalInformation', loanLedgerPersonalInfoRouter)
	app.use('/mentor-matcher', mentorMatcherRouter)
	app.use('/mentor-information', mentorInformationRouter)
	app.use('/mpesa', mpesaRouter)
	app.use('/warrior-information', warriorInformationRouter)
	app.use('/wellness-warrior', warriorRouter)
	app.use('/', mentorSettingsRouter)
	app.use('/currency', currencyRouter)
	app.use('/upload', uploadRouter)

	app.listen(process.env.PORT, () => {
		console.log(`Server running at port ${process.env.PORT}`)
	})

	try {
		await sequelize.authenticate()
		console.log('Database connection has been established successfully.')
	} catch (error) {
		console.error('Unable to connect to the database:', error)
	}
})().catch(err => {
	console.log('Error starting application $s', err.message)
	process.exit(1)
})
