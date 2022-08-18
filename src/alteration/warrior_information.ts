import { DataTypes } from 'sequelize'
import { Status } from '../api/warrior-information/interface'
import { DATABASE_TABLES } from '../constants/db_tables'
import { queryInterface } from '../database'
import { Alteration } from './controller'

const WARRIOR_INFORMATION_TABLE = DATABASE_TABLES.WARRIOR_INFORMATION

export const addStatusColumn = async () => {
	const migration = new Alteration(
		15,
		`Added new status column to ${WARRIOR_INFORMATION_TABLE}`,
		new Date().toISOString(),
		async () => {
			try {
				const table = await queryInterface.describeTable(WARRIOR_INFORMATION_TABLE)

				if (table.status) {
					return true
				}

				await queryInterface.addColumn(WARRIOR_INFORMATION_TABLE, 'status', {
					type: DataTypes.ENUM(...Object.values(Status)),
					defaultValue: Status.PENDING
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

export const removePriceRangeColumn = async () => {
	const migration = new Alteration(
		16,
		`Removed price_range column from ${WARRIOR_INFORMATION_TABLE}`,
		new Date().toISOString(),
		async () => {
			try {
				const table = await queryInterface.describeTable(WARRIOR_INFORMATION_TABLE)

				if (!table.price_range) return true

				await queryInterface.removeColumn(WARRIOR_INFORMATION_TABLE, 'price_range')

				return true
			} catch (error) {
				console.log(error)
				return false
			}
		}
	)

	migration.run()
}

export const addNewColumns = async () => {
	const migration = new Alteration(
		17,
		`Added new columns to ${WARRIOR_INFORMATION_TABLE}`,
		new Date().toISOString(),
		async () => {
			try {
				const table = await queryInterface.describeTable(WARRIOR_INFORMATION_TABLE)

				if (!table.conversation_mode) {
					await queryInterface.addColumn(WARRIOR_INFORMATION_TABLE, 'conversation_mode', { type: DataTypes.STRING })
				}

				if (!table.hourly_rate) {
					await queryInterface.addColumn(WARRIOR_INFORMATION_TABLE, 'hourly_rate', { type: DataTypes.INTEGER })
				}

				if (!table.language) {
					await queryInterface.addColumn(WARRIOR_INFORMATION_TABLE, 'language', { type: DataTypes.STRING })
				}

				return true
			} catch (error) {
				console.log(error)
				return false
			}
		}
	)

	migration.run()
}
