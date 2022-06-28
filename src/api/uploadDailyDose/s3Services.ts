import AWS from 'aws-sdk'

import { Express } from 'express'
console.log(
	process.env.AWS_ACCESS_KEY_ID,
	process.env.AWS_SECRET_ACCESS_KEY,
	process.env.AWS_REGION,
	process.env.AWS_BUCKET_NAME
)

interface IAwsObjectType {
	Key: string
}

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,

	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

	region: process.env.AWS_REGION
})

const s3 = new AWS.S3()

class s3Service {
	public uploadFile(file: Express.Multer.File, uploadPath?: string): Promise<AWS.S3.ManagedUpload.SendData> {
		return new Promise((resolve, reject) => {
			s3.upload(
				{
					Body: file.buffer,

					Key: uploadPath || '/upload/' + new Date() + '_' + file.originalname,

					ACL: 'public-read',

					Bucket: process.env.AWS_BUCKET_NAME || ''
				},

				(error, data) => {
					if (error) reject(error)
					resolve(data)
				}
			)
		})
	}
}

export default s3Service
