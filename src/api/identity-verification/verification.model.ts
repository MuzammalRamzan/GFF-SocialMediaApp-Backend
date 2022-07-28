import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database';
import { User } from '../user/userModel';

export interface IUserVerification {
  id: number;
  user_id: number;
  yoti_session_id: string;
  yoti_session_secret: string;
  yoti_session_result: object
}

export class Verification extends Model { }

Verification.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  identity_verification_status: {
    type: DataTypes.STRING,
  },
  yoti_session_id: {
    type: DataTypes.STRING,
  },
  yoti_session_secret: {
    type: DataTypes.STRING,
  },
  yoti_session_result: {
    type: DataTypes.JSON,
  },
  yoti_checks: {
    type: DataTypes.JSON,
  }
},
  {
    sequelize,
    tableName: 'verification',
  })

Verification.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

Verification.sync();