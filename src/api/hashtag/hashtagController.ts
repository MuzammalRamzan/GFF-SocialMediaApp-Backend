import { Request, Response, NextFunction } from 'express'
import { HashtagService } from './hashtagService'
import { CreateHashtagRequest, 
         DeleteHashtagRequest, 
         GetHashtagByUserInformationIdRequest, 
         UpdateHashtagRequest } from './interface'

export class HashtagController {
	private readonly hashtagService: HashtagService

	constructor() {
		this.hashtagService = new HashtagService()
	}

	getAllHashtags = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const hashtags = await this.hashtagService.list()
			res.status(200).send({ hashtags })
		} catch (err) {
			throw err
		}
	}

	createHashtag = async (req: CreateHashtagRequest, res: Response, next: NextFunction) => {
		const params = req.body

		try {
			const hashtag = await this.hashtagService.add(params)
			res.status(200).send({ hashtag })
		} catch (err) {
			throw err
		}
	}

    getHashtagByUserInformationId = async (req: GetHashtagByUserInformationIdRequest, res: Response, next: NextFunction) => {
        const id = +req.params.user_info_id

        try {
            const hashtags = await this.hashtagService.fetchById(id)
            res.send(hashtags)
        } catch (err) {
            throw err
        }
    }

	updateHashtag = async (req: UpdateHashtagRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const params = req.body

		try {
			const hashtag = await this.hashtagService.update(id, params)
			res.status(200).send({ hashtag })
		} catch (err) {
			throw err
		}
	}

	deleteHashtag = async (req: DeleteHashtagRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id

		try {
			const hashtag = await this.hashtagService.delete(id)
			res.status(200).send({ hashtag })
		} catch (err) {
			throw err
		}
	}
}