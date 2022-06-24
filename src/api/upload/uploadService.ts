import { IUploadService } from './interface'
import AWS from 'aws-sdk'
import s3Services from '../../helper/s3Services'
import { UserInformationService } from '../user-information/userInformationService'
import { UserInformation } from '../user-information/userInformationModel'

export class UploadService implements IUploadService {
	private readonly s3 = new s3Services()
	private readonly UserInformation = new UserInformationService()

	async upload(file: Express.Multer.File, uploadPath?: string): Promise<AWS.S3.ManagedUpload.SendData> {
		return new Promise((resolve, reject) =>
			this.s3
				.uploadFile(file, uploadPath)
				.then(data => resolve(data))
				.catch(error => reject(error))
		)
	}

	async uploadAvatar(user_id: number, file: Express.Multer.File): Promise<UserInformation> {
		const fileName = new Date() + '_' + file.originalname
		const uploadedAvatar = await this.upload(file, `/uploads/user/profile_picture/${user_id}/images/${fileName}`)

		const userDetails = await this.UserInformation.updateUserProfileUrl(uploadedAvatar.Key, user_id)

		return userDetails as UserInformation
	}
}
