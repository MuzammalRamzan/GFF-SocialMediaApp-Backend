import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database';
import { WarriorInformation } from '../warrior-information/warriorInformationModel';

export interface IUser {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    phone_number: string;
    default_currency_id: number;
    role_id: number;
    password: string;
}

export class User extends Model { }
User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull:false,
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    full_name: {
        type: DataTypes.STRING,
        allowNull:false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull:false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull:false
    },
    default_currency_id: {
        type: DataTypes.INTEGER,
        defaultValue:1
    },
    user_feature_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    }
},
    {
        sequelize,
        tableName: 'user',
    })

User.hasOne(WarriorInformation, {
    foreignKey: 'user_id',
    sourceKey: 'id',
    as: 'warrior_information'
})

User.sync();