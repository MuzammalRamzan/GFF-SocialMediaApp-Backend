export type TransactionAccountParms = {
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
    list(): Promise<TransactionAccountParms[]>
    fetch(id: number): Promise<TransactionAccountParms[]>
    add(params: TransactionAccountParms): Promise<TransactionAccountParms[]>
}
