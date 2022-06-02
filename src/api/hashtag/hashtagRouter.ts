import express, { Application } from 'express'
import { HashtagController } from './hashtagController'

const hashtagController = new HashtagController()
export const hashtagRouter = express.Router()

hashtagRouter.get('/list', hashtagController.getAllHashtags)
hashtagRouter.get('/:user_info_id', hashtagController.getHashtagByUserInformationId as Application)
hashtagRouter.post('/add', hashtagController.createHashtag as Application)
hashtagRouter.put('/update/:id', hashtagController.updateHashtag as Application)
hashtagRouter.delete('/delete/:id', hashtagController.deleteHashtag as Application)