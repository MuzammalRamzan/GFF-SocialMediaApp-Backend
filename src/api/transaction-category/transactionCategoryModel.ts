import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database';

export class TransactionCategory extends Model {} 

TransactionCategory.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    icon_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    colour: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('income', 'expense'),
        allowNull: false,
    },
    is_default: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active'
    }
},
{
    sequelize,
    tableName: 'transaction_category',
})
