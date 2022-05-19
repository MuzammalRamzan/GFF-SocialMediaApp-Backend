import mysql from 'mysql2'

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
