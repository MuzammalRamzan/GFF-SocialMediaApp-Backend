import { Includeable } from 'sequelize/types'
import { TransactionAccount } from '../transaction-account/transactionAccModel'
import { TransactionCategory } from '../transaction-category/transactionCategoryModel'
import { ITransactionService, TransactionType } from './interface'
import { Transaction } from './transactionModel'

export class TransactionService implements ITransactionService {
  private readonly include: Includeable | Includeable[] = [
    { model: TransactionCategory, as: 'transaction_category' },
    {
      model: TransactionAccount,
      as: 'transaction_account',
      attributes: ['id', 'balance', 'account_type_id', 'name', 'country', 'currency_id', 'user_id', 'status']
    }
  ]

  async list(): Promise<Transaction[]> {
    const transactions = await Transaction.findAll({
      include: this.include
    })
    return transactions
  }

  async fetchForUser(userId: number): Promise<Transaction[]> {
    const transactions = await Transaction.findAll({
      where: {
        user_id: userId
      }
    })

    return transactions
  }

  async add(params: TransactionType): Promise<Transaction> {
    const created_at = new Date().getTime()
    const transaction = await Transaction.create({
      frequency: params.frequency,
      user_id: params.user_id,
      account_id: params.account_id,
      amount: params.amount,
      category_id: params.category_id,
      status: params.status,
      created_at: created_at,
      due_date: params.due_date,
      payed_at: params.payed_at
    })
    return (await Transaction.findByPk(transaction.getDataValue('id'), {
      include: this.include
    })) as Transaction
  }

  async update(id: number, params: TransactionType): Promise<Transaction> {
    const updatedTransaction = await Transaction.update(
      {
        frequency: params.frequency,
        user_id: params.user_id,
        account_id: params.account_id,
        category_id: params.category_id,
        status: params.status,
        due_date: params.due_date,
        payed_at: params.payed_at,
        amount: params.amount
      },
      {
        where: {
          id: id,
          user_id: params.user_id
        }
      }
    )
    if (updatedTransaction[0] === 1) {
      const transaction = await Transaction.findByPk(id, {
        include: this.include
      })
      return transaction as Transaction
    }

    throw new Error('Unauthorized')
  }

  async delete(id: number, user_id: number): Promise<number> {
    const transaction = await Transaction.destroy({
      where: {
        id: id,
        user_id: user_id
      }
    })
    return transaction
  }
}
