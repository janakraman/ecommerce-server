const { checkToken } = require("../helpers/jsonwebtoken");
const { User } = require("../models");

function authenticate(req, res, next) {
  if (!req.headers.access_token) {
    next({ name: "NoToken" });
  }
  try {
    const decoded = checkToken(req.headers.access_token);
    if (!decoded.id || !decoded.email) {
      next({ name: "InvalidToken" });
    } else if (decoded.role !== "admin") {
      next({ name: "Unauthorized" });
    }

    User.findByPk(decoded.id).then((user) => {
      if (!user || user.email !== decoded.email) {
        next({ name: "InvalidToken" });
      } else {
        const current = {
          id: user.id,
          email: user.email,
          role: user.role,
        };
        req.user = current;
        next();
      }
    });
  } catch (error) {
    next({ name: "InvalidToken" });
  }
}

function authorize(req, res, next) {}

module.exports = { authenticate, authorize };