import AWS from 'aws-sdk'

import { UserInformation } from '../user-information/userInformationModel'

import { UserType } from '../user/interface'

import { Request } from 'express'

export interface IUploadRequest extends Request {
	user: UserType

	file: Express.Multer.File
}

export interface IUploadService {
	upload(file: Express.Multer.File, uploadPath?: string): Promise<AWS.S3.ManagedUpload.SendData>
}
