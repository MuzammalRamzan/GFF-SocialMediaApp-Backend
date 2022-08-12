import { DataTypes } from 'sequelize'
import { DATABASE_TABLES } from '../constants/db_tables'
import { queryInterface } from '../database'
import { Alteration } from './controller'

export const addPromotedTillColumn = async () => {
  const migration = new Alteration(
    9,
    `Added new promoted_till column to ${DATABASE_TABLES.USER}`,
    new Date().toISOString(),
    async () => {
      try {
        const table = await queryInterface.describeTable(DATABASE_TABLES.USER)

        if (table.promoted_till) {
          return true
        }

        await queryInterface.addColumn(DATABASE_TABLES.USER, 'promoted_till', {
          type: DataTypes.DATE,
          defaultValue: null
        })

        return true
      } catch (error) {
        console.log(error)
        return false
      }
    }
  )

  migration.run()
}
