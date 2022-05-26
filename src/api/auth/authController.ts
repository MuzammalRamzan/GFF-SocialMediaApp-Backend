import { Request, Response, NextFunction } from 'express';
import { AuthService } from "./authService";

export class AuthController {
    private readonly authService: AuthService

    constructor () {
        this.authService = new AuthService()
    }

    signUp = async (req: Request, res: Response, next: NextFunction) => {
        const email = req.body.email
        const pass = req.body.password
        try {
            const user = await this.authService.createUser(email + '', pass + '')
            res.status(200).send(user)
        } catch (err) {
            throw err
        }
    }

    logIn = async (req: Request, res: Response, next: NextFunction) => {
        const email = req.body.email
        const password = req.body.password
        try {
            const user = await this.authService.checkCreds(email + '', password + '')

            if (!user) {
                res.status(404).send('User not found')
            }

            const token = this.authService.generateJwtToken(user!.email, user!.password)

            res.set('auth-token', token)

            return res.status(200).send({
                data: {
                    user,
                    token,
                },
                code: 200,
                message: 'OK'
            })
        } catch (err) {
            throw err
        }
    }
}
