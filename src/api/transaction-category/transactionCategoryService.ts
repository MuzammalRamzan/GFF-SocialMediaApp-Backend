import { ITransactionCategoryService, TransactionCategoryType, TransactionCategory } from "./interface";
import { pool } from "../../database";

export class TransactionCategoryService implements ITransactionCategoryService {
    async add (params: TransactionCategory): Promise<TransactionCategory[]> {
        const [rows, fields] = await pool.promise().query(`
        INSERT INTO transaction_category (name, user_id, icon_url, type, is_default, status)
        VALUES (?, ?, ?, ?, ?, ?);`,
        [params.name, params.user_id, params.icon_url, params.type, params.is_default, params.status])

        return rows as TransactionCategory[]
    }

    async list (): Promise<TransactionCategory[]> {
        const [rows, fields] = await pool.promise().query(`SELECT * FROM transaction_category`)
        
        return rows as TransactionCategory[]
    }

    async fetchByUserId (user_id: number): Promise<TransactionCategory[]> {
        const [rows, fields] = await pool.promise().query(`
        SELECT * FROM transaction_category WHERE user_id=?`, user_id)

        return rows as TransactionCategory[]
    }

    async update (id: number, params: TransactionCategory): Promise<TransactionCategory[]> {
        const [rows, fields] = await pool.promise().query(`
        UPDATE transaction_category 
        SET name = ?, user_id = ?, icon_url = ?, type = ?, is_default = ?, status = ?
        WHERE id=?`, [params.name, params.user_id, params.icon_url, params.type, params.is_default, params.status, id])

        return rows as TransactionCategory[]
    }

    async delete (id: number): Promise<TransactionCategory[]> {
        const [rows, fields] = await pool.promise().query(`
        DELETE FROM transaction_category 
        WHERE id=?`, id)

        return rows as TransactionCategory[]
    }
}
