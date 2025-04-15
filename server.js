const app = require("./app");
const environmentVariables = require("./constants/environmentVariables");
const { sequelize } = require("./database");

// Environment Variables
const PORT = environmentVariables.PORT;

// sync our sequelize models and then start server
// force: true, will wipe our database on each server restart
sequelize.sync({ force: true })
    .then(() => {
        // this is our way of making sure the server is not listening 
        // to requests if we have not made a db connection
        app.listen(PORT, () => {
            console.log(`Server started at http://localhost:${PORT}`);
        });
    })
