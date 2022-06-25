import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../database";
import { UserInformationType } from "../user-information/interface";

export interface IWarriorInformation  {
  id: number;
  user_id: number;
  specialty: string[];
  certification: string[];
  therapy_type: string[];
  price_range: string[];
  user?: UserInformationType
}

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