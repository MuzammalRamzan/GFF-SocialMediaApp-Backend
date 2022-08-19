import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database'
import { DATABASE_TABLES } from '../../constants/db_tables'

export interface ICountry {
  id: number
  email: string
  full_name: string
  phone_number: string
  default_currency_id: number
  role_id: number
  password: string
}

export class City extends Model {
}

City.init(
  {
    id: {
      type: DataTypes.MEDIUMINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    state_id: {
      type: DataTypes.MEDIUMINT,
      allowNull: true
    },
    state_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    country_id: {
      type: DataTypes.MEDIUMINT,
      allowNull: true
    },
    country_code: {
      type: DataTypes.CHAR(2),
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
      defaultValue: null
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
      defaultValue: null
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal(
        'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
      )
    },
    flag: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: null
    },
    wikiDataId: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    }
  },
  {
    sequelize,
    tableName: DATABASE_TABLES.CITIES,
    timestamps: true,
    // collate: 'utf8mb4_unicode_ci',
    // charset: 'utf8mb4'
  }
)

City.sync()
