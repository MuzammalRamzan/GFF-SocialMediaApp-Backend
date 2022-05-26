import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database';
import { RequestType } from "./interface"

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
  request_type: {
    type: DataTypes.ENUM(RequestType.SEND, RequestType.APPROVE, RequestType.REJECT),
    defaultValue: RequestType.SEND
  },
},
  {
    sequelize,
    tableName: 'find_friend',
  })

FindFriendModel.sync();
