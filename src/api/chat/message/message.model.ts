import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../database';
import { User } from '../../user/userModel';

export class Message extends Model { }

Message.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  body: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  room_id: {
    type: DataTypes.INTEGER,
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
    tableName: 'message'
  })

Message.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

Message.sync();
