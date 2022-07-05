import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database'

export class UserRole extends Model { }
UserRole.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    authority: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},
    {
        sequelize,
        tableName: 'user_role',
        timestamps: true
    })

UserRole.sync();
