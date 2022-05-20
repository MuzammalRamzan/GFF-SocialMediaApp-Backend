export type TransactionAccountParams = {
    id: number
    account_type_id: number
    balance: number
    name: string
    country: string
    bank_name: string
    card_owner: string
    card_number: string
    card_expiration_date: string
    card_cvc: string
    currency_id: number
    user_id: number
    status: string
}

export interface ITransactionAccount {
    list (): Promise<TransactionAccountParams[]>
    fetch (id: number): Promise<TransactionAccountParams[]>
    add (params: TransactionAccountParams): Promise<TransactionAccountParams[]>
}
