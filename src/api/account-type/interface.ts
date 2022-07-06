import { AccountType } from './accountTypeModel'

export interface IAccountTypeService {
    fetch (): Promise<AccountType[]>
}
