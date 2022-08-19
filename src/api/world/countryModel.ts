import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database'
import { DATABASE_TABLES } from '../../constants/db_tables'
import { State } from './stateModel'
import { City } from './cityModel'

export interface ICountry {
  id: number
  email: string
  full_name: string
  phone_number: string
  default_currency_id: number
  role_id: number
  password: string
}

export class Country extends Model {
}

Country.init(
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
    iso3: {
      type: DataTypes.CHAR(3),
      allowNull: true
    },
    numeric_code: {
      type: DataTypes.CHAR(3),
      allowNull: true
    },
    iso2: {
      type: DataTypes.CHAR(3),
      allowNull: true
    },
    phonecode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    capital: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null
    },
    currency: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null
    },
    currency_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null
    },
    currency_symbol: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null
    },
    tld: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null
    },
    native: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null
    },
    region: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null
    },
    subregion: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null
    },
    timezones: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    translations: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
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
    emoji: {
      type: DataTypes.STRING(191),
      allowNull: true,
      defaultValue: null
    },
    emojiU: {
      type: DataTypes.STRING(191),
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
    tableName: DATABASE_TABLES.COUNTRIES,
    timestamps: true,
    // collate: 'utf8mb4_unicode_ci',
    // charset: 'utf8mb4'
  }
)

Country.hasMany(State, {
  foreignKey: 'country_id',
  as: 'states'
})
State.belongsTo(Country, {
  foreignKey: 'country_id',
  as: 'country'
})

State.hasMany(City, {
  foreignKey: 'state_id',
  as: 'cities'
})
City.belongsTo(State, {
  foreignKey: 'state_id',
  as: 'state'
})

Country.hasMany(City, {
  foreignKey: 'country_id',
  as: 'cities'
})
City.belongsTo(Country, {
  foreignKey: 'country_id',
  as: 'country'
})

Country.sync()
