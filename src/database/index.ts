import mysql from 'mysql2'
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(process.env.RDS_NAME!, process.env.RDS_USERNAME!, process.env.RDS_PASSWORD, {
    host: process.env.RDS_HOSTNAME,
    dialect: 'mysql',
    port: +!process.env.RDS_PORT,
    define: {
        createdAt: false,
        updatedAt: false
    }
});

export const pool = mysql.createPool({
    host : process.env.RDS_HOSTNAME,
    user : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    port : +!process.env.RDS_PORT,
    database: process.env.RDS_NAME,
    waitForConnections: true,
    connectionLimit: 60,
    queueLimit: 1500,
    multipleStatements: true,
    dateStrings: true,
});
