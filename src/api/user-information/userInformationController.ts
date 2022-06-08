import { Response, NextFunction } from 'express';
import { CreateUserInformationRequest, 
         DeleteUserInformationRequest, 
         GetUserInformationByUserIdRequest, 
         UpdateUserInformationRequest} from './interface';
import { UserInformationService } from './userInformationService';

export class UserInformationController {
    private readonly userInformationService: UserInformationService

    constructor () {
        this.userInformationService = new UserInformationService()
    }

    createUserInformation = async (req: CreateUserInformationRequest, res: Response, next: NextFunction) => {
        const user_id = +req.user.id
        const params = {...req.body, user_id}
        try {
            const userInformation = await this.userInformationService.add(params)
            res.status(200).send(userInformation)
        } catch (err) {
            throw err
        }
    }

    getUserInformationByUserId = async (req: GetUserInformationByUserIdRequest, res: Response, next: NextFunction) => {
        const params_user_id = +req.params.user_id
        const userId = +req.user.id

        try {
            const userInformation = await this.userInformationService.fetchById(params_user_id, userId)
            res.status(200).send(userInformation)
        } catch (err) {
            throw err
        }
    }

    updateUserInformation = async (req: UpdateUserInformationRequest, res: Response, next: NextFunction) => {
        const userId = +req.params.user_id
        const user_id = +req.user.id
        const params = {...req.body, user_id}
        try {
            const userInformation = await this.userInformationService.update(userId, params)
            res.status(200).send(userInformation)
        } catch (err) {
            throw err
        }
    }

    deleteUserInformation = async (req: DeleteUserInformationRequest, res: Response, next: NextFunction) => {
        const params_user_id = +req.params.user_id
        const userId = +req.user.id
        try {
            const userInformation = await this.userInformationService.delete(params_user_id, userId)
            res.send({userInformation})
        } catch (err) {
            throw err
        }
    }
}
