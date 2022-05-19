import { IAuthService } from "./interface";
import bcrypt from 'bcrypt';

export class AuthService implements IAuthService {
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10)

        const hash = await bcrypt.hash(password, salt)

        return hash
    }
    generateJwtToken(email: string, password: string): string {
        throw new Error("Method not implemented.");
    }
}
