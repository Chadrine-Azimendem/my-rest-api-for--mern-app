const User = require("./userModel");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");

// test
exports.greetings = (req, res) => {
	res.json({ greetting: "Our controller is working propperly" });
};

// create a users account
exports.createAccount = async (req, res) => {
	console.log("New user created:", req.body);
	try {
		await User.create(req.body);
		res.status(201).send({
			success: true,
			message: `User with username ${req.body.username} has been successfully created `
		});
	} catch (error) {
		console.log(error);
		// send internal error status and the error message
		res.status(400).send({ success: false, error: error.message });
	}
};

// list all users in the database
exports.readUsers = async (req, res) => {
	try {
		const users = await User.find({});
		res.status(200).send({ users: users });
	} catch (error) {
		console.log(error);
		// send internal error status and the error message
		res.status(401).send({ error: error.message });
	}
};

// update any field of the users data
exports.updateUser = async (req, res) => {
	try {
		// define the filter
		const filter = { username: req.body.username };
		// define the field the is been updated
		const update = { [req.body.field]: req.body.to };

		let updatedUser = await User.findOneAndUpdate(filter, update, {
			new: true
		});

		// log updated values in the console
		console.log(updatedUser);
		res.status(200).send({
			message: `the ${req.body.field} has been updated to ${req.body.to}`
		});
	} catch (error) {
		console.log(error);
		// send internal error status and the error message
		res.status(500).send({ error: error.message });
	}
};

// delete user controller
exports.deleteUser = async (req, res) => {
	try {
		const filter = { username: req.body.username };
		const checkUser = await User.findOne(filter);
		if (checkUser) {
			console.log("User found:", checkUser);
		} else {
			console.log("User not found");
		}
		const deletedUser = await User.deleteOne(filter);
		// test
		if (deletedUser.deletedCount === 1) {
			console.log("user deleted", deletedUser);
			res.status(200).send({
				outcome: `user ${req.body.username} successfully deleted`
			});
		} else {
			res.status(501).send("user not deleted");
		}
	} catch (error) {
		console.log(error);
		// send internal error status and the error message
		res.status(501).send({ error: error.message });
	}
};

// login controller
exports.userLogin = async (req, res, next) => {
	console.log("middleware passed and controller has been called");
	try {
		if (req.authUser) {
			console.log("token check passed and continue to persistant login");
			res.status(200).send({
				username: req.authUser.username,
				success: true
			});

			// return here so that the process does not continue down to manual login but goes directly to persistant login.
			return;
		}
		//continue to manual login insteat, and check if the user's username exist in the database
		const user = await User.findOne({ username: req.body.username });
		console.log(`Success! ${user.username} exists in the database`);

		//generate a jwt token that encodes the users unique id and the SECRET token pass
		const token = await jwt.sign({ _id: user._id }, process.env.SECRET);
		console.log("manual logins generated Token: ", token);

		// save token in a cookie in case we chosed to do so in the backend.
		// res.cookie("token", token, { httpOnly: true });

		// send username, success value and the generated Token in the response object
		res.status(202).send({
			success: true,
			token: token,
			username: user.username
		});
	} catch (error) {
		console.log(error);
		next(new ErrorResponse("username not found", 501));
	}
};

// user logout not working yet fix it
exports.userLogout = async (req, res, next) => {
	try {
		res.clearCookie("token");
		res.status(200).send({
			success: true,
			message: "user logged out successfully"
		});
	} catch (error) {
		console.log(error);
		next(new ErrorResponse(error.message, 501));
	}
};

// read single user with custom error handling

exports.readOneUser = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id);
		res.status(200).send({
			success: true,
			user
		});
	} catch (error) {
		next(
			new ErrorResponse(`User with id: ${req.params.id} not found`, 404)
		);
	}
};
