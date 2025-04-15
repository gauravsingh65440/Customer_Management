const environemntVarables = require("../constants/environmentVariables");
const jwt = require("jsonwebtoken");

module.exports.generateJwtToken = (payload) => {
    return jwt.sign(payload, environemntVarables.JWT_SECRET_KEY, { expiresIn: "7d" });
};

module.exports.verifyJwtToken = (token) => {
    try {
        return jwt.verify(token, environemntVarables.JWT_SECRET_KEY);
    } catch (error) {
        throw new Error("TOken is either expired or invalid!");
    }
};