import { IAuthService } from "./interface";
import { pool } from "../../database";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

    async createUser (email: string, password: string): Promise<any> {
        const passwordHash = await this.hashPassword(password)

        const [rows, fields] = await pool.promise().query(`
        INSERT INTO user (role_id, firstname, lastname, email, password, phone_number)
        VALUES (1, 'ime', 'prezime', ?, ?, 091234567);`,
        [email, passwordHash]
        )

        return rows
    }

    async checkEmail(email: string): Promise<any> {
        const [rows, fields] = await pool.promise().query(`SELECT * FROM user WHERE email=${email}`)
        return rows
    
    }
}
