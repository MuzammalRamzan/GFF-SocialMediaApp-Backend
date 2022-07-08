import { AccountType } from './accountTypeModel'
import { IAccountTypeService } from './interface'

export class AccountTypeService implements IAccountTypeService {
    async fetch(): Promise<AccountType[]> {
        const types = await AccountType.findAll()

        return types
    }
}
