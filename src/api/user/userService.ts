import { IUserService } from "./interface";
import { User } from "./interface";
import { pool } from "../../database";

export class UserService implements IUserService {
    async list (): Promise<User[]> {
        const [rows, fields] = await pool.promise().query(`SELECT * FROM user`)
        
        return rows as User[]
    }

    async fetchById (id: number): Promise<User[]> {
        const [rows, fields] = await pool.promise().query(`
        SELECT * FROM user WHERE id=?`, id)

        return rows as User[]
    }

    async fetchByEmail (email: string): Promise<User[]> {
        const [rows, fields] = await pool.promise().query(`SELECT * FROM user WHERE email=?`, email)

        return rows as User[]
    }
}
