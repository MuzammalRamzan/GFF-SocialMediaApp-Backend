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
        const params = req.body
        try {
            const userInformation = await this.userInformationService.add(params)
            res.status(200).send(userInformation)
        } catch (err) {
            throw err
        }
    }

    getUserInformationByUserId = async (req: GetUserInformationByUserIdRequest, res: Response, next: NextFunction) => {
        const user_id = +req.params.user_id

        try {
            const userInformation = await this.userInformationService.fetchById(user_id)
            res.status(200).send(userInformation)
        } catch (err) {
            throw err
        }
    }

    updateUserInformation = async (req: UpdateUserInformationRequest, res: Response, next: NextFunction) => {
        const id = +req.params.id
        const params = req.body
        try {
            const userInformation = await this.userInformationService.update(id, params)
            res.status(200).send(userInformation)
        } catch (err) {
            throw err
        }
    }

    deleteUserInformation = async (req: DeleteUserInformationRequest, res: Response, next: NextFunction) => {
        const id = +req.params.id
        try {
            const userInformation = await this.userInformationService.delete(id)
            res.send({userInformation})
        } catch (err) {
            throw err
        }
    }
}
