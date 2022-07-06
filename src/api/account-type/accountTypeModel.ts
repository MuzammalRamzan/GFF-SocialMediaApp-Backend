import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database'

export class AccountType extends Model { }
AccountType.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    icon_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},
    {
        sequelize,
        tableName: 'account_type',
        timestamps: true
    })

AccountType.sync();
