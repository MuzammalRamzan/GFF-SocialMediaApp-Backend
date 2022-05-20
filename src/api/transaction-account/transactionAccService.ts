import { ITransactionAccount, TransactionAccountParams } from "./interface";
import { pool } from "../../database";

export class TransactionAccService implements ITransactionAccount {
    async list(): Promise<TransactionAccountParams[]> {
        const [rows, fields] = await pool.promise().query(`SELECT * FROM transaction_account`)
        return rows as TransactionAccountParams[];
    }

    async fetch(id: number): Promise<TransactionAccountParams[]> {
        const [rows, fields] = await pool.promise().query(`SELECT * FROM transaction_account WHERE id=? `, id)

        return rows as TransactionAccountParams[];
    }

    async add(params: TransactionAccountParams): Promise<TransactionAccountParams[]> {
        const [rows, fields] = await pool.promise().query(`
        INSERT INTO transaction_account (account_type_id, balance, name, country, bank_name, card_owner, card_number, card_expiration_date, card_cvc, currency_id, user_id, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [params.account_type_id, params.balance, params.name, params.country, params.bank_name, params.card_owner, params.card_number, params.card_expiration_date, params.card_cvc, params.currency_id, params.user_id, params.status]
        )

        return rows as TransactionAccountParams[];
    }
}
