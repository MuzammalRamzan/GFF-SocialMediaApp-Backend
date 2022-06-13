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
  tableName: 'warrior_information',
  hooks: {
    afterFind(instancesOrInstance: any) {
      if (instancesOrInstance) {
        if (Array.isArray(instancesOrInstance)) {
          instancesOrInstance.forEach((instance) => {
            instance.setDataValue('price_range', instance.getDataValue('price_range') ? instance.getDataValue('price_range').split(',') : []);
            instance.setDataValue('therapy_type', instance.getDataValue('therapy_type') ? instance.getDataValue('therapy_type').split(',') : []);
            instance.setDataValue('certification', instance.getDataValue('certification') ? instance.getDataValue('certification').split(',') : []);
            instance.setDataValue('specialty', instance.getDataValue('specialty') ? instance.getDataValue('specialty').split(',') : []);
          });
        } else {
          instancesOrInstance.setDataValue('price_range', instancesOrInstance.getDataValue('price_range') ? instancesOrInstance.getDataValue('price_range').split(',') : []);
          instancesOrInstance.setDataValue('therapy_type', instancesOrInstance.getDataValue('therapy_type') ? instancesOrInstance.getDataValue('therapy_type').split(',') : []);
          instancesOrInstance.setDataValue('certification', instancesOrInstance.getDataValue('certification') ? instancesOrInstance.getDataValue('certification').split(',') : []);
          instancesOrInstance.setDataValue('specialty', instancesOrInstance.getDataValue('specialty') ? instancesOrInstance.getDataValue('specialty').split(',') : []);
        }
      }
    },
  }
})

WarriorInformation.sync();