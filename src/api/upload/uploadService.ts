import { IUploadService } from './interface'
import AWS from 'aws-sdk'
import s3Services from '../../helper/s3Services'
import { UserInformationService } from '../user-information/userInformationService'
import { UserInformation } from '../user-information/userInformationModel'

export class UploadService implements IUploadService {
	private s3: s3Services;
	private UserInformation: UserInformationService;

	constructor() {
		this.s3 = new s3Services()
		this.UserInformation = new UserInformationService()
	}

	upload = async (file: Express.Multer.File, uploadPath?: string): Promise<AWS.S3.ManagedUpload.SendData> => {
		return new Promise((resolve, reject) =>
			this.s3
				.uploadFile(file, uploadPath)
				.then(data => resolve(data))
				.catch(error => {
					console.log(error);
					reject(error)
				})
		)
	}

	uploadAvatar = async (user_id: number, file: Express.Multer.File): Promise<UserInformation> => {
		const fileName = new Date().getTime() + '_' + file.originalname;
		let fileNameWithoutSpace = fileName.replace(/\s/g, '_');

		if (fileNameWithoutSpace.length > 200) {
			const ext = fileNameWithoutSpace.split('.').pop();
			fileNameWithoutSpace = fileNameWithoutSpace.substring(0, 40) + ext;
		}

		const uploadedAvatar = await this.upload(file, `/uploads/user/profile_picture/${user_id}/images/${fileNameWithoutSpace}`)

		const userDetails = await this.UserInformation.updateUserProfileUrl(uploadedAvatar.Key, user_id)

		return userDetails as UserInformation
	}
}
