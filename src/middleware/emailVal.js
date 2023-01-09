const User = require("../users/userModel");
const ErrorResponse = require("../utils/errorResponse");

exports.validateEmail = async (req, res, next) => {
  try {
    const userObj = await User.findOne({ username: req.body.username });
    console.log("User found is:", userObj);
    if (userObj && req.body.email === userObj.email) {
      console.log("the email is corect");
      next();
    } else {
      // throw Error("incorect username or password");
      next(new ErrorResponse("incorect username or password", 401));
    }
  } catch (error) {
    console.log(error);
    next(new ErrorResponse("incorect username or password", 401));
  }
};
