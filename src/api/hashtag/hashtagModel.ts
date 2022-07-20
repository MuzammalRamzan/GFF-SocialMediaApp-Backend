import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database';
import { User } from '../user/userModel';

export class Hashtag extends Model { }
Hashtag.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    hashtag_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
    {
        sequelize,
        tableName: 'hashtag',
    })

Hashtag.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

Hashtag.sync();