import { DataTypes, Model } from 'sequelize';
import { DATABASE_TABLES } from '../constants/db_tables';
import { sequelize } from '../database';

export class AlterationModel extends Model { }

AlterationModel.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timestamps: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.fn('NOW')
  }
},
  {
    sequelize,
    tableName: DATABASE_TABLES.ALTERATIONS,
  })

AlterationModel.sync();
