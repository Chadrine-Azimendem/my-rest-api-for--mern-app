// import bcrypt
const bcrypt = require("bcrypt");
const User = require("../users/userModel");
const ErrorResponse = require("../utils/errorResponse");

// hash user password with salting of 12 saltRounds
exports.hashPassword = async (req, res, next) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 12);
    next();
  } catch (error) {
    console.log(error);
    next(new ErrorResponse(error.message, 417));
  }
};

exports.matchePasswds = async (req, res, next) => {
  try {
    // read user with entered username in the database
    req.user = await User.findOne({ username: req.body.username });
    // log the entered password
    console.log("PLAIN TEXT PASSWORD:", req.body.password);
    // log the ciphertext password database
    console.log("HASHED PASSWORD:", req.user.password);
    // Check if the usename exist in database and the corresponding PW matches the entered PW
    if (
      req.user &&
      (await bcrypt.compare(req.body.password, req.user.password))
    ) {
      console.log(
        "username exists and plain text password matches hashed password"
      );
      next();
    } else {
      // throw new Error("incorect username or password");
      next(new ErrorResponse("incorect username or password", 401));
    }
  } catch (error) {
    console.log(error);
    next(new ErrorResponse("incorect username or password", 401));
  }
};
