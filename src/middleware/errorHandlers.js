const errorHandler = (err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .send({ success: false, error: err.message || "srver Error" });
};
module.exports = errorHandler;
