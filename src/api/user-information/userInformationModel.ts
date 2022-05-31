import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database';

export class UserInformation extends Model {} 
UserInformation.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bio: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date_of_birth: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: false
        
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    zip_code: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hashtags: {
        type: DataTypes.STRING,
        allowNull: false
    },
    social_media: {
        type: DataTypes.STRING,
        allowNull: false
    },
    employer_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    job_role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    education: {
        type: DataTypes.STRING,
        allowNull: false
    },
    other_education: {
        type: DataTypes.STRING
    },
    profile_role: {
        type: DataTypes.ENUM('employer', 'mentor', 'wellness warrior'),
        allowNull: false
    }
},
{
    sequelize,
    tableName: 'user_information',
})
