import { Request, Response, NextFunction } from 'express';
import { UserService } from './userService';

export class UserController {
    private readonly userService: UserService

    constructor () {
        this.userService = new UserService()
    }

    getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.userService.list()
            res.send(users)
        } catch (err) {
            throw err
        }
    }

    getUsersById = async (req: Request, res: Response, next: NextFunction) => {
        const id = +req.params.id

        try {
            const users = await this.userService.fetchById(id)
            res.send(users)
        } catch (err) {
            throw err
        }
    }

    getUsersByEmail = async (req: Request, res: Response, next: NextFunction) => {
        const email = req.params.email
        try {
            const users = await this.userService.fetchByEmail(email + '')
            res.send(users)
        } catch (err) {
            throw err
        }
    }

    updateUser = async (req: Request, res: Response, next: NextFunction) => {
        const id = +req.params.id
        const params = req.body
        try {
            const user = await this.userService.update(id, params)
            res.send(user)
        } catch (err) {
            throw err
        }
    }

    deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        const id = +req.params.id
        try {
            const user = await this.userService.delete(id)
            res.send({user})
        } catch (err) {
            throw err
        }
    }
}
