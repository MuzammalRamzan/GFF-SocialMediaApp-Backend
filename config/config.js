require('dotenv').config()

module.exports = {
	development: {
		username: 'admin',
		password: 'R4OUuw65GMgTMUoRwpvn',
		database: 'gff_dev',
		host: 'gff-dev1.cnh9v2u3ksbp.us-east-1.rds.amazonaws.com',
		dialect: 'mysql'
	},
	test: {
		username: 'root',
		password: null,
		database: 'database_test',
		host: '127.0.0.1',
		dialect: 'mysql'
	},
	production: {
		username: 'admin',
		password: 'ipGoZoV9VcbC8x',
		database: 'gff-prod',
		host: 'gff-prod.cvdthrxpxpf7.eu-central-1.rds.amazonaws.com',
		dialect: 'mysql'
	}
}
