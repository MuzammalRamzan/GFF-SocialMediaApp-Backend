import { IDailyDoseType, DailyDoseType } from './interface'
import { DailyDose } from './dailyDoseModel'
import AWS from 'aws-sdk'
import s3Services from '../../helper/s3Services'

export class DailyDoseService implements IDailyDoseType {
	private s3: s3Services

	constructor() {
		this.s3 = new s3Services()
	}
	async add(params: DailyDoseType): Promise<DailyDose> {
		const dailyDose = await DailyDose.create({
			title: params.title,
			subtitle: params.subtitle,
			image: params.image,
			contentURL: params.contentURL,
			keyWord: params.keyWord,
			category: params.category,
			contentBody: params.contentBody
		})
		return dailyDose
	}
	async findByCategory(category: string): Promise<DailyDose[]> {
		const dailyDose = await DailyDose.findAll({
			where: {
				category: category
			}
		})

		if (!dailyDose) {
			throw new Error('Unauthorized')
		}

		return dailyDose
	}
	async update(paramsId: number, params: DailyDoseType): Promise<DailyDose> {
		await DailyDose.update(
			{
				title: params.title,
				subtitle: params.subtitle,
				image: params.image,
				contentURL: params.contentURL,
				keyWord: params.keyWord,
				category: params.category
			},
			{
				where: {
					id: paramsId
				}
			}
		)

		const newUpdatedRow = await DailyDose.findByPk(paramsId)
		return newUpdatedRow as DailyDose
	}

	async delete(id: number): Promise<number> {
		const deletedRow = await DailyDose.destroy({
			where: {
				id: id
			}
		})
		if (!deletedRow) {
			throw new Error('No data found against this ID')
		}

		return deletedRow
	}
	async findAllCategory(category: string): Promise<DailyDose[]> {
		const dailyDose = await DailyDose.findAll()

		if (!dailyDose) {
			throw new Error('no data found')
		}

		return dailyDose
	}
	upload = async (file: Express.Multer.File, uploadPath?: string): Promise<AWS.S3.ManagedUpload.SendData> => {
		const fileName = new Date().getTime() + '_' + file.originalname

		let fileNameWithoutSpace = fileName.replace(/\s/g, '_')

		if (fileNameWithoutSpace.length > 200) {
			const ext = fileNameWithoutSpace.split('.').pop()

			fileNameWithoutSpace = fileNameWithoutSpace.substring(0, 40) + ext
		}

		return new Promise((resolve, reject) =>
			this.s3

				.uploadFile(file, `/uploads/dailyDose/images/${fileNameWithoutSpace}`)

				.then(data => resolve(data))

				.catch(error => {
					reject(error)
				})
		)
	}
}
