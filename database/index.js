// Database Connection Logic
const { Sequelize } = require("sequelize");
const environmentVariables = require("../constants/environmentVariables");

const sequelize = new Sequelize(
    environmentVariables.DB_NAME,
    environmentVariables.DB_USER,
    environmentVariables.DB_PASSWORD,
    {
        host: environmentVariables.DB_HOST,
        port: environmentVariables.DB_PORT,
        dialect: "postgres",
    }
);

sequelize.authenticate()
    .then(() => {
        console.log("Connected to PostreSQL!");
    })
    .catch((error) => {
        console.error("PostgreSQL connection error: ", error);
    })

module.exports = { sequelize };