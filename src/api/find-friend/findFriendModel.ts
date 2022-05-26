import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database';

export class FindFriendModel extends Model { }

FindFriendModel.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  sender_id: {
    type: DataTypes.INTEGER
  },
  receiver_id: {
    type: DataTypes.INTEGER
  },
  is_approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
},
  {
    sequelize,
    tableName: 'find_friend',
  })
