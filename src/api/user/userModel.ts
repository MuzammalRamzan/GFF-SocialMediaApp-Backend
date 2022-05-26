import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database';

export class User extends Model {} 
User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    role_id: {
        type: DataTypes.INTEGER
    },
    firstname: {
        type: DataTypes.STRING
    },
    lastname: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING
    },
    phone_number: {
        type: DataTypes.STRING
    },
    default_currency_id: {
        type: DataTypes.INTEGER
    }
},
{
    sequelize,
    tableName: 'user',
})
