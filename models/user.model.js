const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const UserModel = sequelize.define(
	"User",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},

		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [2, 50], // built-in validation: ensures name is between 2 and 50 characters
			},
		},

		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true, // built-in validation: ensures the email is valid
			},
		},

		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		passwordChangedAt: {
			type: DataTypes.DATE,
		},

		phone: {
			type: DataTypes.STRING,
		},

		address: {
			type: DataTypes.STRING,
		},
	},
	{}
);

module.exports = UserModel;
