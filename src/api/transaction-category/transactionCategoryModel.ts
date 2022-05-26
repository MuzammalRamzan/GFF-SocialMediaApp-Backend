import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database';

export class TransactionCategoryModel extends Model {} 

TransactionCategoryModel.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    user_id: {
        type: DataTypes.INTEGER
    },
    icon_url: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.ENUM('income', 'expense')
    },
    is_default: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.STRING
    }
},
{
    sequelize,
    tableName: 'transaction_category',
})
