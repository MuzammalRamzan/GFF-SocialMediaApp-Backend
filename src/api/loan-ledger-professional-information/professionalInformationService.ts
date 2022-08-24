import { ILoanLedgerProfessionalInformationService, LoanLedgerProfessionalInformationType } from './interface'
import { LoanLedgerProfessionalInformation } from './professionalInformationModel'
import s3Services from '../../helper/s3Services'
import { AWS_S3_BASE_BUCKET_URL } from '../../constants'

export class LoanLedgerProfessionalInformationService implements ILoanLedgerProfessionalInformationService {
	private s3: s3Services

	constructor() {
		this.s3 = new s3Services()
	}

	upload = async (file: Express.Multer.File, uploadPath?: string): Promise<AWS.S3.ManagedUpload.SendData> => {
		return new Promise((resolve, reject) =>
			this.s3
				.uploadFile(file, uploadPath)
				.then(data => resolve(data))
				.catch(error => {
					console.log(error)
					reject(error)
				})
		)
	}
	uploadDocument = async (userId: number, file: Express.Multer.File): Promise<string> => {
		const fileName = new Date().getTime() + '_' + file.originalname
		let fileNameWithoutSpace = fileName.replace(/\s/g, '_')

		if (fileNameWithoutSpace.length > 200) {
			const ext = fileNameWithoutSpace.split('.').pop()
			fileNameWithoutSpace = fileNameWithoutSpace.substring(0, 40) + ext
		}

		const uploadedAvatar = await this.upload(file, `/uploads/loan-ledger/documents/${userId}/${fileNameWithoutSpace}`)
		const uploadedPdfUrl = AWS_S3_BASE_BUCKET_URL + uploadedAvatar.Key

		return uploadedPdfUrl
	}

	async list(): Promise<LoanLedgerProfessionalInformation[]> {
		const professionalInformation = await LoanLedgerProfessionalInformation.findAll()
		return professionalInformation
	}

	async fetchById(id: number, userId: number): Promise<LoanLedgerProfessionalInformation> {
		const professionalInformation = await LoanLedgerProfessionalInformation.findOne({
			where: {
				id: id,
				user_id: userId
			}
		})

		if (!professionalInformation) {
			throw new Error('Unauthorized')
		}
		return professionalInformation as LoanLedgerProfessionalInformation
	}

	async fetchByUserId(user_id: number): Promise<LoanLedgerProfessionalInformation[]> {
		const professionalInformation = await LoanLedgerProfessionalInformation.findAll({
			where: {
				user_id: user_id
			}
		})

		return professionalInformation as LoanLedgerProfessionalInformation[]
	}

	async add(params: LoanLedgerProfessionalInformationType): Promise<LoanLedgerProfessionalInformation> {
		try {
			const url = await this.uploadDocument(+params.user_id, params.document)

			const professionalInformation = await LoanLedgerProfessionalInformation.create({
				user_id: params.user_id,
				employment_type: params.employment_type,
				company_name: params.company_name,
				profession: params.profession,
				education: params.education,
				net_monthly_salary: params.net_monthly_salary,
				work_experience: params.work_experience,
				document_url: url
			})
			return professionalInformation
		} catch (err) {
			throw new Error('Professional information already exists')
		}
	}

	async update(id: number, params: LoanLedgerProfessionalInformationType): Promise<LoanLedgerProfessionalInformation> {
		const loan = await LoanLedgerProfessionalInformation.findOne({
			where: {
				id: id,
				user_id: params.user_id
			}
		})

		if (!loan) {
			throw new Error('Unauthorized')
		}

		let reqObj: any = {
			user_id: params.user_id,
			employment_type: params.employment_type,
			company_name: params.company_name,
			profession: params.profession,
			education: params.education,
			net_monthly_salary: params.net_monthly_salary,
			work_experience: params.work_experience
		}

		if (params.document) {
			const url = await this.uploadDocument(+params.user_id, params.document)

			reqObj = {
				...reqObj,
				document_url: url
			}
		}

		await LoanLedgerProfessionalInformation.update(reqObj, {
			where: {
				id: id
			}
		})
		const newUpdatedRow = await LoanLedgerProfessionalInformation.findOne({
			where: {
				id: id
			}
		})
		return newUpdatedRow as LoanLedgerProfessionalInformation
	}

	async delete(id: number, userId: number): Promise<number> {
		const deletedRow = await LoanLedgerProfessionalInformation.destroy({
			where: {
				id: id,
				user_id: userId
			}
		})
		if (!deletedRow) {
			throw new Error('Unauthorized')
		}
		return deletedRow
	}
}
