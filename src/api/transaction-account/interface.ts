export interface ITransactionAccount {
    list (): Promise<any>
    fetch (params: any): Promise<any>
    add (params: any): Promise<any>
}
