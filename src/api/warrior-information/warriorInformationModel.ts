import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../database";

export class WarriorInformation extends Model { }

WarriorInformation.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  specialty: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  certification: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  therapy_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price_range: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  sequelize: sequelize,
  tableName: 'warrior_information'
})

WarriorInformation.sync();