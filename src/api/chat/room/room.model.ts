import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../database';
import { Message } from '../message/message.model';

export class Room extends Model { }

Room.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  user_ids: {
    // separated by comma
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date(),
  }
},
  {
    sequelize,
    tableName: 'room'
  })

// Room.hasMany(Message, {
//   foreignKey: 'room_id',
//   as: 'messages'
// })

Room.sync();
