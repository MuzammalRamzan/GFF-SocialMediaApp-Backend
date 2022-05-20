import { IAuthService } from "./interface";
import { pool } from "../../database";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from "../user/interface";

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

    async createUser (email: string, password: string): Promise<User[]> {
        const passwordHash = await this.hashPassword(password)

        const [rows, fields] = await pool.promise().query(`
        INSERT INTO user (role_id, firstname, lastname, email, password, phone_number)
        VALUES (1, 'ime', 'prezime', ?, ?, 091234567);`,
        [email, passwordHash]
        )

        return rows as User[]
    }

    async checkCreds (email: string, password: string): Promise<User[] | undefined> {
        const user = await this.checkEmail(email)
        const isValid = await this.checkPass(password, user[0].password)

        if (!isValid) {
            return
        }

        return user
    }

    private async checkEmail (email: string): Promise<User[]> {
        const [rows, fields] = await pool.promise().query(`SELECT * FROM user WHERE email=?`, email)
        return rows as User[]
    }

    private async checkPass (pass: string, hashedPass: string): Promise<boolean> {
        return bcrypt.compare(pass, hashedPass)
    }
}
