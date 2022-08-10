import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database';

export class UserInformation extends Model {}
UserInformation.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true
    },
    profile_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date_of_birth: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true
    },
    zip_code: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    twitter: {
        type: DataTypes.STRING,
        allowNull: true
    },
    facebook: {
        type: DataTypes.STRING,
        allowNull: true
    },
    instagram: {
        type: DataTypes.STRING,
        allowNull: true
    },
    linkedin: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tiktok: {
        type: DataTypes.STRING,
        allowNull: true
    },
    employer_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    job_role: {
        type: DataTypes.STRING,
        allowNull: true
    },
    education: {
        type: DataTypes.STRING,
        allowNull: true
    },
    other_education: {
        type: DataTypes.STRING,
        allowNull: true
    },
    latitude:{
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude:{
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    braintree_customer_id: {
			type: DataTypes.STRING,
			allowNull: true
		}

},
{
    sequelize,
    tableName: 'user_information',
})
