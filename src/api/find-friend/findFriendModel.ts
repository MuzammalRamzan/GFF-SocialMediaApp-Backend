import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database';
import { RequestType } from "./interface"
import { User } from "../user/userModel"

export interface IFriendRequest {
  id: number;
  sender_id: number;
  receiver_id: number;
  request_type: RequestType;
}

export class FindFriendModel extends Model { }

FindFriendModel.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
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

FindFriendModel.belongsTo(User, {
  foreignKey: 'sender_id',
  as: 'sender'
});

FindFriendModel.belongsTo(User, {
  foreignKey: 'receiver_id',
  as: 'receiver'
});

FindFriendModel.sync();
