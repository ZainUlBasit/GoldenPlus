const JwtService = require("../Services/JwtServices");
const { createError } = require("../utils/ResponseMessage");
const jwt = require("jsonwebtoken");
const privateKey = process.env.ACCESS_SECRET_KEY;

const VerifyUserCookie = async (req, res, next) => {
  let token = req.cookies["userToken"]
    ? req.cookies["userToken"]
    : req.headers["usertoken"]
    ? req.headers["usertoken"]
    : null;
  if (!token) return createError(res, 401, "Not Logged In!");

  try {
    const user = jwt.verify(token, privateKey);
    if (user) {
      req.user = user._doc;
      next();
      return;
    } else {
      return res
        .status(403)
        .json({ success: false, error: { msg: "Invalid token!" } });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({});
  }
  // try {
  //   const { accesstoken } = req.cookies;
  //   if (!accesstoken) {
  //     throw new Error("Please login first");
  //   }
  //   const userData = await JwtService.verifyAccessToken(accesstoken);
  //   if (!userData) {
  //     throw new Error("No user found");
  //   }
  //   console.log("userData: ", userData);
  //   req.user = userData;
  //   next();
  // } catch (error) {
  //   return createError(res, 401, error.message);
  // }
};
const VerifyBranch = async (req, res, next) => {
  try {
    if (req.user.role !== 2)
      throw new Error("Unauthorized to access this route!");
    next();
  } catch (error) {
    return createError(res, 401, error.message);
  }
};
const VerifyAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 1)
      throw new Error("Unauthorized to access this route!");
    next();
  } catch (error) {
    return createError(res, 401, error.message);
  }
};
const VerifyBranchId = async (req, res, next) => {
  try {
    if (req.user.branch !== req.body.branch)
      throw new Error("Branch # not matched!");
    next();
  } catch (error) {
    return createError(res, 401, error.message);
  }
};

module.exports = {
  VerifyUserCookie,
  VerifyAdmin,
  VerifyBranch,
  VerifyBranchId,
};
