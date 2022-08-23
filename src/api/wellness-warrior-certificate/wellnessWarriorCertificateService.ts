import { WellnessWarriorsCertificate } from './wellnessWarriorCertificateModel'
import { GffError } from '../helper/errorHandler'
import {
	IWellnessWarriorsCertificateService,
	WellnessWarriorsCertificateParams,
	WellnessWarriorsCertificateUpdateParams
} from './interface'
import { WellnessWarrior } from '../wellness-warrior/wellnessWarriorModel'
import { AWS_S3_BASE_BUCKET_URL } from '../../constants'
import s3Services from '../../helper/s3Services'
import { ManagedUpload } from 'aws-sdk/clients/s3'

export class WellnessWarriorsCertificateService implements IWellnessWarriorsCertificateService {
	s3: any
	constructor() {
		this.s3 = new s3Services()
	}

	private getWarriorById = async (wellnessWarriorId: number): Promise<WellnessWarrior> => {
		const wellnessWarrior = await WellnessWarrior.findByPk(wellnessWarriorId)

		if (wellnessWarrior) {
			return wellnessWarrior
		} else {
			const err = new GffError('wellness warrior not found!')
			err.errorCode = '404'
			err.httpStatusCode = 404
			throw err
		}
	}

	upload = async (file: Express.Multer.File, uploadPath?: string): Promise<AWS.S3.ManagedUpload.SendData> => {
		return new Promise((resolve, reject) =>
			this.s3
				.uploadFile(file, uploadPath)
				.then((data: ManagedUpload.SendData | PromiseLike<ManagedUpload.SendData>) => resolve(data))
				.catch((error: any) => {
					console.log(error)
					reject(error)
				})
		)
	}

	uploadWellnessWarriorCertificate = async (
		wellness_warrior_id: number,
		file: Express.Multer.File
	): Promise<string> => {
		const fileName = new Date().getTime() + '_' + file.originalname
		let fileNameWithoutSpace = fileName.replace(/\s/g, '_')

		if (fileNameWithoutSpace.length > 200) {
			const ext = fileNameWithoutSpace.split('.').pop()
			fileNameWithoutSpace = fileNameWithoutSpace.substring(0, 40) + ext
		}

		const uploadedAvatar = await this.upload(
			file,
			`/uploads/wellness_warrior/certificates/${wellness_warrior_id}/pdf_files/${fileNameWithoutSpace}`
		)
		const uploadedPdfUrl = AWS_S3_BASE_BUCKET_URL + uploadedAvatar.Key

		return uploadedPdfUrl
	}

	getCertificateById = async (id: number): Promise<WellnessWarriorsCertificate> => {
		const certificate = await WellnessWarriorsCertificate.findOne({ where: { id } })

		if (!certificate) {
			const err = new GffError('wellness warrior certificate not found!')
			err.errorCode = '404'
			err.httpStatusCode = 404
			throw err
		}

		return certificate?.get()
	}

	create = async (params: WellnessWarriorsCertificateParams): Promise<WellnessWarriorsCertificate> => {
		const { wellness_warrior_id, pdfFile, authority, title, year } = params
		await this.getWarriorById(+params.wellness_warrior_id)

		const url = await this.uploadWellnessWarriorCertificate(+wellness_warrior_id, pdfFile)

		const createCertificate = await WellnessWarriorsCertificate.create({
			authority,
			title,
			year,
			pdfUrl: url,
			wellness_warrior_id
		})

		return this.getCertificateById(createCertificate.get().id)
	}

	update = async (params: WellnessWarriorsCertificateUpdateParams): Promise<WellnessWarriorsCertificate | null> => {
		const { wellness_warrior_id, pdfFile, id } = params

		await this.getCertificateById(id)

		if (wellness_warrior_id) {
			await this.getWarriorById(params.wellness_warrior_id)
		}

		let obj = JSON.parse(JSON.stringify(params))

		delete obj.pdfFile
		delete obj.id

		let reqObj = {
			...obj
		}

		if (pdfFile) {
			const url = await this.uploadWellnessWarriorCertificate(+wellness_warrior_id, pdfFile)

			reqObj = {
				...reqObj,
				pdfUrl: url
			}
		}

		await WellnessWarriorsCertificate.update(reqObj, { where: { id } })

		return this.getCertificateById(id)
	}

	getAll = async (id: number): Promise<WellnessWarriorsCertificate[]> => {
		const warriorsCertificates = await WellnessWarriorsCertificate.findAll({
			where: { wellness_warrior_id: id }
		})
		return warriorsCertificates
	}

	deleteCertificateById = async (id: number): Promise<boolean> => {
		const certificate = await WellnessWarriorsCertificate.findOne({ where: { id } })

		if (!certificate) {
			const err = new GffError('wellness warrior certificate not found!')
			err.errorCode = '404'
			err.httpStatusCode = 404
			throw err
		} else {
			await WellnessWarriorsCertificate.destroy({ where: { id } })
			return true
		}
	}
}
