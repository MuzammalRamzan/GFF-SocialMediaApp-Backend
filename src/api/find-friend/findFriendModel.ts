import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database';
import { RequestStatus, RequestType } from "./interface"
import { User } from "../user/userModel"

export interface IFriendRequest {
  id: number;
  sender_id: number;
  receiver_id: number;
  status: RequestStatus;
  block_reason?: string;
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
    type: DataTypes.ENUM(RequestType.BLOCK, RequestType.FRIEND),
    defaultValue: RequestType.FRIEND
  },
  block_reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM(RequestStatus.SEND, RequestStatus.APPROVE, RequestStatus.REJECT),
    defaultValue: RequestStatus.SEND
  }
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
