import e, { Request, Response, NextFunction } from 'express';
import { AuthService } from "./authService";

export class AuthController {
    private readonly authService: AuthService

    constructor () {
        this.authService = new AuthService()
    }

    signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.authService.createUser('email', 'password')
            res.send(user)
        } catch (err) {
            throw err
        }
    }
}
