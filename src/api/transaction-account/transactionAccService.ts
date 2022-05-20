import { ITransactionAccount, TransactionAccountParms } from "./interface";
import { pool } from "../../database";

export class TransactionAccService implements ITransactionAccount {
    async list(): Promise<TransactionAccountParms[]> {
        const [rows, fields] = await pool.promise().query(`SELECT * FROM transaction_account`)
        return rows as TransactionAccountParms[];
    }
    async fetch(id: number): Promise<TransactionAccountParms[]> {
        const [rows, fields] = await pool.promise().query(`SELECT * FROM transaction_account WHERE id=? `, id)

        return rows as TransactionAccountParms[];
    }
    async add(params: TransactionAccountParms): Promise<TransactionAccountParms[]> {
        const [rows, fields] = await pool.promise().query(`
        INSERT INTO transaction_account (account_type_id, balance, name, country, bank_name, card_owner, card_number, card_expiration_date, card_cvc, currency_id, user_id, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [params.account_type_id, params.balance, params.name, params.country, params.bank_name, params.card_owner, params.card_number, params.card_expiration_date, params.card_cvc, params.currency_id, params.user_id, params.status]
        )

        return rows as TransactionAccountParms[];
    }
    
}