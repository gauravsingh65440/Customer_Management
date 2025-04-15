const dotenv = require("dotenv");
dotenv.config();

const environmentVariables = {
    PORT: process.env.PORT || "8000",
    NODE_ENV: process.env.NODE_ENV,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT,
    DB_HOST: process.env.DB_HOST,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY
};

module.exports = environmentVariables;