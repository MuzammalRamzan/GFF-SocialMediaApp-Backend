import { IAuthService } from "./interface";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from "../user/userModel";
import { UserType } from "../user/interface";

export class AuthService implements IAuthService {
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10)

        const hash = await bcrypt.hash(password, salt)

        return hash
    }

    generateJwtToken(email: string, password: string): string {
            const timestamp = Date.now() / 1000;
            const token = jwt.sign(
            {
                exp: Math.floor(timestamp + 60 * 120),
                iat: timestamp,
                email,
                password
            },
            process.env.JWT_SECRET!
        )
        return token;
    }

    async createUser (email: string, fullName: string, password: string): Promise<User> {
        const passwordHash = await this.hashPassword(password)

        const user = await User.create({       
            role_id: '1',
            full_name: fullName,
            email: email, 
            password: passwordHash, 
            default_currency_id: '1'
        })

        return user as User
    }

    async checkCreds (email: string, password: string): Promise<UserType | undefined> {
        const user = await this.checkEmail(email)
        const isValid = await this.checkPass(password, user.password)

        if (!isValid) {
            return
        }

        return user
    }

    private async checkEmail (email: string): Promise<UserType> {
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        return user as any
    }

    private async checkPass (pass: string, hashedPass: string): Promise<boolean> {
        return bcrypt.compare(pass, hashedPass)
    }
}