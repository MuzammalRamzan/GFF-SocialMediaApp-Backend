import { IDailyDoseType, DailyDoseType } from './interface'
import { DailyDose } from './dailyDoseModel'
import AWS from 'aws-sdk'
import { readFileSync, readFile, writeFileSync, promises as fsPromises, readdirSync, statSync, unlinkSync } from 'fs'
import { join, basename } from 'path'
import s3Services from '../../helper/s3Services'
export class DailyDoseService implements IDailyDoseType {
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
	async add(params: DailyDoseType): Promise<DailyDose> {
		const dailyDose = await DailyDose.create({
			title: params.title,
			subtitle: params.subtitle,
			image: params.image,
			contentURL: params.contentURL,
			keyWord: params.keyWord,
			category: params.category,
			isInternalLink: params.isInternalLink
		})
		return dailyDose
	}
	async findByCategory(category: string): Promise<DailyDose[]> {
		let dailyDose: DailyDose[] = []
		if (category) {
			dailyDose = await DailyDose.findAll({
				order: [['created_at', 'ASC']],
				where: {
					category: category
				}
			})
		} else {
			dailyDose = await DailyDose.findAll({
				order: [['created_at', 'ASC']]
			})
		}
		if (!dailyDose) {
			throw new Error('Unauthorized')
		}
		return dailyDose
	}
	async asyncWriteFile(content: string) {
		try {
			await fsPromises.writeFile(join(__dirname, 'dailyDoseArticle.html'), content, {
				flag: 'w'
			})
			return await fsPromises.readFile(`${__dirname}/dailyDoseArticle.html`)
		} catch (error) {
			throw new Error('Write file error found!')
		}
	}
	asyncDeleteFile() {
		try {
			unlinkSync(`${__dirname}/dailyDoseArticle.html`)
		} catch (error) {
			throw new Error('Delete File Error')
		}
	}

	async update(paramsId: number, params: DailyDoseType): Promise<DailyDose> {
		await DailyDose.update(
			{
				title: params.title,
				subtitle: params.subtitle,
				image: params.image,
				contentURL: params.contentURL,
				keyWord: params.keyWord,
				category: params.category,
				isInternalLink: params.isInternalLink
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
	async upload(file: Express.Multer.File, uploadPath?: string): Promise<AWS.S3.ManagedUpload.SendData> {
		const fileName = new Date().getTime() + '_' + file.originalname

		let fileNameWithoutSpace = fileName.replace(/\s/g, '_')

		if (fileNameWithoutSpace.length > 200) {
			const ext = fileNameWithoutSpace.split('.').pop()

			fileNameWithoutSpace = fileNameWithoutSpace.substring(0, 40) + ext
		}

		return new Promise((resolve, reject) =>
			this.s3

				.uploadFile(file, `uploads/dailyDose/images/${fileNameWithoutSpace}`)

				.then(data => resolve(data))

				.catch(error => {
					reject(error)
				})
		)
	}
	async uploadContentBody(file: any, uploadPath?: string): Promise<AWS.S3.ManagedUpload.SendData> {
		const fileName = new Date().getTime() + '_' + 'dailyDoseArticle.html'

		let fileNameWithoutSpace = fileName.replace(/\s/g, '_')

		if (fileNameWithoutSpace.length > 200) {
			const ext = fileNameWithoutSpace.split('.').pop()

			fileNameWithoutSpace = fileNameWithoutSpace.substring(0, 40) + ext
		}

		return new Promise((resolve, reject) =>
			this.s3

				.uploadHTMLFile(file, `uploads/dailyDose/${fileNameWithoutSpace}`)

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
}
