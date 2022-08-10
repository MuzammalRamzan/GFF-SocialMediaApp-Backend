import { DataTypes } from 'sequelize'
import { DATABASE_TABLES } from '../constants/db_tables'
import { queryInterface } from '../database'
import { Alteration } from './controller'

export const addLatitudeColumn = async () => {
	const migration = new Alteration(
		1,
		`Added new latitude column to ${DATABASE_TABLES.USER_INFORMATION}`,
		new Date().toISOString(),
		async () => {
			try {
				const table = await queryInterface.describeTable(DATABASE_TABLES.USER_INFORMATION)

				if (table.latitude) {
					return true
				}

				await queryInterface.addColumn(DATABASE_TABLES.USER_INFORMATION, 'latitude', {
					type: DataTypes.DECIMAL(10, 8),
					allowNull: true
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

export const addLongitudeColumn = async () => {
	const migration = new Alteration(
		1,
		`Added new longitude column to ${DATABASE_TABLES.USER_INFORMATION}`,
		new Date().toISOString(),
		async () => {
			try {
				const table = await queryInterface.describeTable(DATABASE_TABLES.USER_INFORMATION)

				if (table.longitude) {
					return true
				}

				await queryInterface.addColumn(DATABASE_TABLES.USER_INFORMATION, 'longitude', {
					type: DataTypes.DECIMAL(11, 8),
					allowNull: true
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

export const addBraintreeCustomerIdColumn = async () => {
	const migration = new Alteration(
		1,
		`Added new braintree_customer_id column to ${DATABASE_TABLES.USER_INFORMATION}`,
		new Date().toISOString(),
		async () => {
			try {
				const table = await queryInterface.describeTable(DATABASE_TABLES.USER_INFORMATION)
				console.log({ table })

				if (table.braintree_customer_id) {
					return true
				}

				await queryInterface.addColumn(DATABASE_TABLES.USER_INFORMATION, 'braintree_customer_id', {
					type: DataTypes.STRING,
					allowNull: true
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
