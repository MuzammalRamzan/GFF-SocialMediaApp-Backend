import { IAuthService } from "./interface";
import bcrypt from 'bcrypt';
const jwt = require('jsonwebtoken');

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
            process.env.JWT_SECRET
        )
        return token;
    }
}
