import Express, { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import cors from 'cors'
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
import { dailyDoseRouter } from './api/daily-dose/dailyDoseRouter'
import { dailyArticleRouter } from './api/dailyArticle/dailyArticleRouter'
import {
	loanLedgerProfessionalInformationRouter
} from './api/loan-ledger-professional-information/professionalInformationRouter'
import {
	loanLedgerPersonalInfoRouter
} from './api/loan-ledger-personal-information/loanLedgerPersonalInformationRouter'
import { mentorMatcherRouter } from './api/mentor-matcher/mentorMatcherRouter'
import { mentorInformationRouter } from './api/mentor-information/mentorInformationRouter'
import { mpesaRouter } from './api/mpesa-auth/mpesaRouter'
import { roomRoute } from './api/chat/room/room.routes'
import { messageRoute } from './api/chat/message/message.routes'
import { warriorInformationRouter } from './api/warrior-information/warriorInformationRouter'
import { warriorRouter } from './api/wellness-warrior/wellnessWarriorRouter'
import { mentorSettingsRouter } from './api/mentor-settings/settingsRouter'
import { currencyRouter } from './api/currency/currencyRouter'
import { uploadRouter } from './api/upload/uploadRouter'
import { GffError, jsonErrorHandler } from './api/helper/errorHandler'
import { feedbackRouter } from './api/feedback/feedbackRouter'
import { roleRouter } from './api/user-role/userRole.routes'
import { identityVerification } from './api/identity-verification/verification.route'

import { mentorInfoRouter } from './api/Questionnaire/questionnaireRouter'
import { UserAnswersRouter } from './api/MentorAnswers/userAnsewerRouter'
import { promocodeRouter } from './api/promocode/promocodeRouter'

import { paymentRouter } from './api/payment-api/paymentRouter'
import { crewRouter } from './api/crew/crewRouter'
import { crewMemberRouter } from './api/crewMember/crewMemberRouter'
import { userFCMTokenRouter } from './api/user-fcm-token/userFCMTokenRouter'
import { dashboardRouter } from './api/dashboard/dashboard.routes'
import { meetingRouter } from './api/meetings/meeting.routes'
import { worldRouter } from './api/world/worldRouter'

const storage = multer.memoryStorage()

const options = {
	swaggerOptions: {
		filter: true
	}
}

export const upload = multer({
	storage,
	limits: { fileSize: 1000000000 }
});

(async function main(): Promise<void> {
	const app = Express()

	app.use(cors())
	// CORS error fix
	app.use((req: Request, res: Response, next: NextFunction) => {
		res.setHeader('Access-Control-Allow-Origin', '*')
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE')
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
		if (req.method === 'OPTIONS') {
			return res.sendStatus(200)
		}
		return next()
	})

	app.use(bodyParser.json())
	// app.get("/api-docs/swagger.json", (req, res) => res.json(swaggerDocument));
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options))
	app.use('/auth', authRouter)
	app.use('/upload', uploadRouter)
	app.use('/user', userRouter)
	app.use('/role', roleRouter)
	app.use('/transaction', transactionRouter)
	app.use('/transactionAccount', transactionAccRouter)
	app.use('/transactionCategory', transactionCategoryRouter)
	app.use('/record', recordRouter)
	app.use('/find-friend', findFriendRouter)
	app.use('/userInformation', userInformationRouter)
	app.use('/hashtag', hashtagRouter)
	app.use('/debt', debtRouter)
	app.use('/dailyDose', dailyDoseRouter)
	app.use('/dailyArticle', dailyArticleRouter)
	app.use('/loanLedgerProfessionalInformation', loanLedgerProfessionalInformationRouter)
	app.use('/loanLedgerPersonalInformation', loanLedgerPersonalInfoRouter)
	app.use('/mentor-matcher', mentorMatcherRouter)
	app.use('/mentor-information', mentorInformationRouter)
	app.use('/mpesa', mpesaRouter)
	app.use('/room', roomRoute)
	app.use('/message', messageRoute)
	app.use('/warrior-information', warriorInformationRouter)
	app.use('/wellness-warrior', warriorRouter)
	app.use('/', mentorSettingsRouter)
	app.use('/currency', currencyRouter)
	app.use('/feedback', feedbackRouter)
	app.use('/identity', identityVerification)
	app.use('/fcm-token', userFCMTokenRouter)
	app.use('/mentor-information', mentorInfoRouter)
	app.use('/mentor-information', UserAnswersRouter)
	app.use('/promocode', promocodeRouter)
	app.use('/dashboard', dashboardRouter)
	app.use('/payment', paymentRouter)
	app.use('/meeting', meetingRouter)
	app.use('/crew', crewRouter)
	app.use('/crew-member', crewMemberRouter)
	app.use('/world', worldRouter)

	app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
		const error = err as GffError
		if (error.message.toLowerCase() === 'no data found') {
			error.errorCode = '404'
			error.httpStatusCode = 404
		} else if (error?.errorCode) {
			error.httpStatusCode = +error?.errorCode
		} else {
			error.errorCode = '500'
			error.httpStatusCode = 500
		}

		return jsonErrorHandler(err, req, res, () => { })
	})

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
