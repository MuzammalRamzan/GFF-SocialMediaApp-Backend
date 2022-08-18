import { IDailyArticleType, DailyArticleType } from './interface'
import { DailyArticle } from './dailyArticleModel'
import AWS from 'aws-sdk'
import s3Services from '../../helper/s3Services'
import { Op, where, fn, col } from 'sequelize'
import { readFileSync, readFile, writeFileSync, promises as fsPromises, readdirSync, statSync, unlinkSync } from 'fs'
import { join, basename } from 'path'

export class DailyArticleService implements IDailyArticleType {
	private s3: s3Services

	constructor() {
		this.s3 = new s3Services()
	}
	validURL(link: string) {
		var pattern = new RegExp(
			'^(https?:\\/\\/)?' + // protocol
				'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
				'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
				'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
				'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
				'(\\#[-a-z\\d_]*)?$',
			'i'
		) // fragment locator
		return !!pattern.test(link)
	}
	async asyncWriteFile(content: string) {
		try {
			await fsPromises.writeFile(join(__dirname, 'dailyArticle.html'), content, {
				flag: 'w'
			})
			return await fsPromises.readFile(`${__dirname}/dailyArticle.html`)
		} catch (error) {
			throw new Error('Write file error found!')
		}
	}
	asyncDeleteFile() {
		try {
			unlinkSync(`${__dirname}/dailyArticle.html`)
		} catch (error) {
			throw new Error('Delete File Error')
		}
	}
	async add(params: DailyArticleType): Promise<DailyArticle> {
		const dailyArticle = await DailyArticle.create({
			title: params.title,
			subtitle: params.subtitle,
			image: params.image,
			contentURL: params.contentURL,
			keyWord: params.keyWord,
			category: params.category,
			isInternalLink: params.isInternalLink
		})
		return dailyArticle
	}
	async findByCategory(category: string): Promise<DailyArticle[]> {
		const dailyArticle = await DailyArticle.findAll({
			order: [['created_at', 'ASC']],
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
		const dailyArticle = await DailyArticle.findAll({
			order: [['created_at', 'ASC']]
		})

		if (!dailyArticle) {
			throw new Error('no data found')
		}

		return dailyArticle
	}
	async uploadContentBody(file: any, uploadPath?: string): Promise<AWS.S3.ManagedUpload.SendData> {
		const fileName = new Date().getTime() + '_' + 'dailyArticle.html'

		let fileNameWithoutSpace = fileName.replace(/\s/g, '_')

		if (fileNameWithoutSpace.length > 200) {
			const ext = fileNameWithoutSpace.split('.').pop()

			fileNameWithoutSpace = fileNameWithoutSpace.substring(0, 40) + ext
		}

		return new Promise((resolve, reject) =>
			this.s3

				.uploadHTMLFile(file, `uploads/dailyArticle/${fileNameWithoutSpace}`)

				.then(async data => {
					await this.asyncDeleteFile()
					resolve(data)
				})

				.catch(error => {
					console.log('error', error)

					reject(error)
				})
		)
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
