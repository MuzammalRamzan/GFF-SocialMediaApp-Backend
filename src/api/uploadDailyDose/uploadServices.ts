import { IUploadService } from './interface'

import AWS from 'aws-sdk'

import s3Services from './s3Services'

export class UploadService implements IUploadService {
	private s3: s3Services

	constructor() {
		this.s3 = new s3Services()
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

				.uploadFile(file, `/uploads/dailyDose/post_image/images/${fileNameWithoutSpace}`)

				.then(data => resolve(data))

				.catch(error => {
					reject(error)
				})
		)
	}
}
