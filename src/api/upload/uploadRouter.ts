import express, { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import s3Service from '../../helper/s3Services'

export const uploadRouter = express.Router()

const s3 = new s3Service()

uploadRouter.post('/avatar', multer().single('avatar'), async (req: Request, res: Response, next: NextFunction) => {
	if (req.file) {
		return s3
			.uploadFile(req.file, '/upload/user/profile_picture/121/' + new Date() + '_' + req.file.originalname)
			.then(data => res.status(200).json({ data }))
			.catch(error => res.status(500).send(error))

		// return s3
		// 	.deleteFile([{ Key: '/upload/user/profile_picture/121/RENAMED.jpg' }])
		// 	.then(data => res.status(200).json({ data }))
		// 	.catch(error => res.status(500).send(error))
	}
	return res.status(500).json({ message: 'file not found!' })
})
