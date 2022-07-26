import { IDailyArticleType, DailyArticleType } from './interface'
import { DailyArticle } from './dailyArticleModel'
import AWS from 'aws-sdk'
import s3Services from '../../helper/s3Services'
import { Op, where, fn, col } from 'sequelize'

export class DailyArticleService implements IDailyArticleType {
	private s3: s3Services

	constructor() {
		this.s3 = new s3Services()
	}
	async add(params: DailyArticleType): Promise<DailyArticle> {
		const dailyArticle = await DailyArticle.create({
			title: params.title,
			subtitle: params.subtitle,
			image: params.image,
			contentURL: params.contentURL,
			keyWord: params.keyWord,
			category: params.category,
			contentBody: params.contentBody
		})
		return dailyArticle
	}
	async findByCategory(category: string): Promise<DailyArticle[]> {
		const dailyArticle = await DailyArticle.findAll({
			where: {
				category: {
					[Op.like]: `%${category}%`
				}
			}
		})

		if (!dailyArticle) {
			throw new Error('Unauthorized')
		}

		return dailyArticle
	}
	async update(paramsId: number, params: DailyArticleType): Promise<DailyArticle> {
		await DailyArticle.update(
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

		const newUpdatedRow = await DailyArticle.findByPk(paramsId)
		return newUpdatedRow as DailyArticle
	}

	async delete(id: number): Promise<number> {
		const deletedRow = await DailyArticle.destroy({
			where: {
				id: id
			}
		})
		if (!deletedRow) {
			throw new Error('No data found against this ID')
		}

		return deletedRow
	}
	async findAllCategory(category: string): Promise<DailyArticle[]> {
		const dailyArticle = await DailyArticle.findAll()

		if (!dailyArticle) {
			throw new Error('no data found')
		}

		return dailyArticle
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

				.uploadFile(file, `/uploads/dailyArticle/images/${fileNameWithoutSpace}`)

				.then(data => resolve(data))

				.catch(error => {
					reject(error)
				})
		)
	}
}
