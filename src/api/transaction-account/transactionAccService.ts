import { ITransactionAccountService, TransactionAccountType } from './interface'
import { TransactionAccount } from './transactionAccModel'

// TODO: pull data from db with user id and join it with account types table

export class TransactionAccService implements ITransactionAccountService {
  async list(): Promise<TransactionAccount[]> {
    const transactionAcc = await TransactionAccount.findAll()
    return transactionAcc as TransactionAccount[]
  }

  async fetch(id: number, userId: number): Promise<TransactionAccount[]> {
    const transactionAccount = await TransactionAccount.findAll({
      where: {
        id: id,
        user_id: userId
      }
    })

    return transactionAccount
  }

  async fetchForUser(userId: number): Promise<TransactionAccount[]> {
    const accounts = await TransactionAccount.findAll({
      where: {
        user_id: userId
      },
      attributes: ['id', 'account_type_id', 'balance', 'currency_id', 'name', 'status', 'user_id']
    })

    return accounts
  }

  async add(params: TransactionAccountType): Promise<TransactionAccount> {
    const transactionAccount = await TransactionAccount.create({
      balance: params.balance,
      account_type_id: params.account_type_id,
      name: params.name,
      country: params.country,
      bank_name: params.bank_name,
      card_owner: params.card_owner,
      card_number: params.card_number,
      card_expiration_date: params.card_expiration_date,
      card_cvc: params.card_cvc,
      currency_id: params.currency_id,
      user_id: params.user_id,
      status: params.status
    })
    return transactionAccount
  }

  async update(id: number, params: TransactionAccountType): Promise<TransactionAccount> {
    const updatedTransactionAccount = await TransactionAccount.update(
      {
        balance: params.balance,
        account_type_id: params.account_type_id,
        name: params.name,
        country: params.country,
        bank_name: params.bank_name,
        card_owner: params.card_owner,
        card_number: params.card_number,
        card_expiration_date: params.card_expiration_date,
        card_cvc: params.card_cvc,
        currency_id: params.currency_id,
        user_id: params.user_id,
        status: params.status
      },
      {
        where: {
          id: id,
          user_id: params.user_id
        }
      }
    )
    if (updatedTransactionAccount[0] === 1) {
      const transactionAccount = await TransactionAccount.findByPk(id)
      return transactionAccount as TransactionAccount
    }

    throw new Error('Unauthorized')
  }

  async delete(id: number, userId: number): Promise<number> {
    const deletedRow = await TransactionAccount.destroy({
      where: {
        id: id,
        user_id: userId
      }
    })

    return deletedRow
  }
}
