import { IAuthService } from "./interface";

export class AuthService implements IAuthService {
    hashPassword(password: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    generateJwtToken(email: string, password: string): string {
        throw new Error("Method not implemented.");
    }
}
