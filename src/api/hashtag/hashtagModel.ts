import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database';

export class Hashtag extends Model {} 
Hashtag.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull:false
    },
    hashtag_name: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    user_information_id: {
        type: DataTypes.STRING,
        allowNull:false
    }
},
{
    sequelize,
    tableName: 'hashtag',
})
