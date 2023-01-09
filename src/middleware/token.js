const jwt = require("jsonwebtoken");
const User = require("../users/userModel");

exports.tokenCheck = async (req, res, next) => {
	try {
		// get the Authorization's value from headers, replace the string "Bearer "
		//by an empty string "", and store it in the variable Token.
		const token = req.header("Authorization").replace("Bearer ", "");

		//check if the request headers has Authorization key
		if (!req.header("Authorization")) {
			console.log("no token passed");
			throw new Error("No token passed");
		} else {
			console.log("token:", token);
		}

		// check if the token contains the secret code and store the decoded token in decodedToken
		const decodedToken = await jwt.verify(token, process.env.SECRET);
		console.log("The decoded token is:", decodedToken);

		// find the user with id decodedToken._id in the users database
		const user = await User.findById(decodedToken._id);

		if (user) {
			console.log("the matching user is:", user + "\n");
			req.authUser = user;
			next();
		} else {
			throw new Error("user is not authorised");
		}
	} catch (error) {
		console.log(error);
		res.status(500).send({ error: error.message });
	}
};
