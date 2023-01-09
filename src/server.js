require("./db/connection");

// require Node packages
const express = require("express");
const userRouter = require("./users/userRoutes");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandlers");

const app = express();

//use the cors package to allow access from any IP address
app.use(cors());

// dfine a port
const port = process.env.PORT || 5001;

// tell the server to use json format data only
app.use(express.json());
app.use(userRouter);
app.use(cookieParser);
app.use(errorHandler);
app.get("/health", (req, res) => {
	res.status(200).send({ message: "API is working" });
});

// tell the server to listen to predefined port
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
