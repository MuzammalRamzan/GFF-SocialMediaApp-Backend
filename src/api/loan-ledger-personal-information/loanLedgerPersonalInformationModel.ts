import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database';

export class LoanLedgerPersonalInformation extends Model {} 
LoanLedgerPersonalInformation.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    full_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    national_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date_of_birth: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    registration_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM('male', 'female'),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mobile_phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    current_residence: {
        type: DataTypes.STRING,
        allowNull: false
    },
    house_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true
    }
},
{
    sequelize,
    tableName: 'loan_ledger_personal_information',
})
