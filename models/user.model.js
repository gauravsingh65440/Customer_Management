const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");
const bcrypt = require("bcrypt");

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

// Custom Hooks

// `beforeCreate` hook is called just before a new record is inserted nto the database via `.create()`.
UserModel.addHook("beforeCreate", async (user, options) => {
	// `user`: `user` is the actual instance being created or updated (an object representing a row in the table).
	// `options`: `options` is an object that holds metadata or extra configuration related to the Sequelize operation (like .create(), .update(), etc.).
	if (user.password) {
		const hashedPassword = await bcrypt.hash(user.password, 12); // password hashing
		user.password = hashedPassword;
	}
});


// `beforeUpdate` hook is called when you update an existing record.
// Only triggers if .save() or .update() is called on an existing record
UserModel.addHook("beforeUpdate", async (user, options) => {
	// `user`: `user` is the actual instance being created or updated (an object representing a row in the table).
	// `options`: `options` is an object that holds metadata or extra configuration related to the Sequelize operation (like .create(), .update(), etc.).
	if (user.password) {
		const hashedPassword = await bcrypt.hash(user.password, 12); // password hashing
		user.password = hashedPassword;
	}
});

// Custom Instance Methods
// Instance method to compare the pasword provided by the user during the login process.
UserModel.prototype.comparePassword = async function (enteredPassword) {
	// console.log("Entered:", enteredPassword);
	// console.log("Stored Hash:", this.password);
	// console.log("User: ", this);
	return await bcrypt.compare(enteredPassword, this.password);
};

// Instance methods to verify Json Web Token.
UserModel.prototype.isTokenValid = function (jwtTimestamp) {
	// If the user has changed their password after the token was issued. Then `this.passwordChangedAt` is not `undefined` it must contain a date object.
	if (this.passwordChangedAt) {
		// JWT timestamps (iat - issued at) are in seconds.
		// Convert JWT timestamp to milliseconds and compare
		return jwtTimestamp * 1000 > this.passwordChangedAt.getTime();
	}

	// if passwordChangedAt is undefined (i.e., the password was never changed after token issuance).
	return true;
};

module.exports = UserModel;
