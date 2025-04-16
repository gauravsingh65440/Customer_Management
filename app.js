const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const globalErrorHandlingMiddleware = require("./middlewares/globalErrorHandlingMiddleware");
const AppRoutes = require("./routes/index");

// Initializing express `app`.
const app = express();

// Middlewares
app.use(
	cors({
		origin: "*", // allowing all origins - in Development Mode,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
		credentials: true,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

// App Routes
app.get("/", (req, res) => {
	return res.status(200).send("Hello from server!");
});

app.use("/api/v1", AppRoutes);

// Global Error Hndling Middleware
app.use(globalErrorHandlingMiddleware);

module.exports = app;
