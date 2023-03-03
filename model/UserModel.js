
const sequelize = require('../database/database')
const { Sequelize } = require('sequelize')

const User = sequelize.define('user', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	username: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true
	},
	role: {
		type: Sequelize.STRING,
		allowNull: false
	}
})

module.exports = User