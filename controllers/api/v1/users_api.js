const User = require("../../../models/user");
const jwt = require("jsonwebtoken");
const env = require("../../../config/environment");

module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });
    console.log("Body", req.body);

    if (!user) {
      return res.json(422, {
        message: "User not found",
      });
    }

    if (user.password != req.body.password) {
      return res.json(422, {
        message: "Invalid username/Password",
      });
    }

    return res.json(200, {
      message: "sign in successful here is your token",
      data: {
        token: jwt.sign((await user).toJSON(), env.jwt_secret, {
          expiresIn: "100000",
        }),
      },
    });
  } catch {
    console.log("*******", err);
    res.json(500, {
      message: "internal server error",
    });
  }
};
