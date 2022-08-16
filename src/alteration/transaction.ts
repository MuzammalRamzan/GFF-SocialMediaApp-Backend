import { DataTypes } from "sequelize";
import { RecurringStatus, transactionType } from "../api/transaction/interface";
import { DATABASE_TABLES } from "../constants/db_tables"
import { queryInterface } from "../database";
import { Alteration } from "./controller"

export const addRecurringStatusColumn = async () => {
  const migration = new Alteration(
    1,
    `Added new recurring_status column to ${DATABASE_TABLES.TRANSACTION}`,
    new Date().toISOString(),
    async () => {
      try {
        const table = await queryInterface.describeTable(DATABASE_TABLES.TRANSACTION);

        if (table.recurring_status) {
          return true;
        }

        await queryInterface.addColumn(
          DATABASE_TABLES.TRANSACTION,
          'recurring_status',
          {
            type: DataTypes.ENUM(RecurringStatus.Active, RecurringStatus.Inactive),
            allowNull: true,
            defaultValue: RecurringStatus.Inactive
          }
        );

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  )

  migration.run();
}

export const changeStatusColumnDataType = async () => {
  const migration = new Alteration(
    2,
    `Changed status column data type to ${DATABASE_TABLES.TRANSACTION}`,
    new Date().toISOString(),
    async () => {
      try {
        await queryInterface.changeColumn(
          DATABASE_TABLES.TRANSACTION,
          'status',
          {
            type: DataTypes.ENUM('Active', 'Inactive', 'Deleted', 'Paid'),
            allowNull: true,
          }
        );

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  );

  migration.run();
}

export const allowNullInDueAndPaidAtColumns = async () => {
  const migration = new Alteration(
    5,
    `Rename payed_at column to paid_at in ${DATABASE_TABLES.TRANSACTION}`,
    new Date().toISOString(),
    async () => {
      try {

        const table = await queryInterface.describeTable(DATABASE_TABLES.TRANSACTION);

        if (table.payed_at) {
          await queryInterface.renameColumn(
            DATABASE_TABLES.TRANSACTION,
            'payed_at',
            'paid_at',
          );
        } else {
          await queryInterface.changeColumn(DATABASE_TABLES.TRANSACTION, 'paid_at', { allowNull: true, type: DataTypes.DATE });
        }

        await queryInterface.changeColumn(DATABASE_TABLES.TRANSACTION, 'due_date', { allowNull: true, type: DataTypes.DATE });

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  )

  migration.run();
}

export const addTransactionTypeColumn = async () => {
  const migration = new Alteration(
    4,
    `Added new transaction_type column to ${DATABASE_TABLES.TRANSACTION}`,
    new Date().toISOString(),
    async () => {
      try {
        const table = await queryInterface.describeTable(DATABASE_TABLES.TRANSACTION);

        if (table.transaction_type) {
          return true;
        }

        await queryInterface.addColumn(
          DATABASE_TABLES.TRANSACTION,
          'transaction_type',
          {
            type: DataTypes.ENUM(transactionType.INCOME, transactionType.EXPENSE)
          }
        );

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    })

  migration.run();
}

export const renameIconColumnInCategory = async () => {
  const migration = new Alteration(
    3,
    `Rename icon column in ${DATABASE_TABLES.TRANSACTION_CATEGORY}`,
    new Date().toISOString(),
    async () => {
      try {
        const table = await queryInterface.describeTable(DATABASE_TABLES.TRANSACTION_CATEGORY);

        if (table.icon_url) {
          console.log("Rename the field!")
          await queryInterface.removeColumn(
            DATABASE_TABLES.TRANSACTION_CATEGORY,
            'icon_url',
          );

          if (!table.icon_id) {
            await queryInterface.addColumn(
              DATABASE_TABLES.TRANSACTION_CATEGORY,
              'icon_id',
              {
                type: DataTypes.INTEGER,
                allowNull: false,
              }
            );
          }

        } else if (!table.icon_id) {
          console.log('create the field')
          await queryInterface.addColumn(
            DATABASE_TABLES.TRANSACTION_CATEGORY,
            'icon_id',
            {
              type: DataTypes.INTEGER,
              allowNull: false,
            }
          );
        }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  )

  migration.run();
}

export const allowNullInTransactionAccount = async () => {
  const migration = new Alteration(
    10,
    `Allow null to bank columns for ${DATABASE_TABLES.TRANSACTION_ACCOUNT}`,
    new Date().toISOString(),
    async () => {
      try {
        const strFields = [
          'country',
          'bank_name',
          'card_owner',
          'card_number',
          'card_cvc',
        ];

        await Promise.all(strFields.map((field) => {
          return queryInterface.changeColumn(
            DATABASE_TABLES.TRANSACTION_ACCOUNT,
            field,
            {
              type: DataTypes.STRING,
              allowNull: true
            }
          );
        }))

        await queryInterface.changeColumn(
          DATABASE_TABLES.TRANSACTION_ACCOUNT,
          'card_expiration_date',
          {
            type: DataTypes.STRING,
            allowNull: true
          }
        );



        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  )

  migration.run();
}