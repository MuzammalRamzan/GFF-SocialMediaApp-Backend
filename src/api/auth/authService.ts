import { IAuthService } from "./interface";
const bcrypt = require('bcrypt');

export class AuthService implements IAuthService {
    hashPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(process.env.SALT_ROUNDS), (err: Object, salt: string) => {
                if (err) reject(err);
                bcrypt.hash(password, salt, (err: Object, hash: string) => {
                  if (err) reject(err);
                  else resolve(hash);
                });
              };
        })
    }
    generateJwtToken(email: string, password: string): string {
        throw new Error("Method not implemented.");
    }
}
