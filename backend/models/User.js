const { model } = require("mongoose");
const { UserSchema } = require("../Schemas/UserSchema");


const UserModel = model("user", UserSchema);

module.exports = { UserModel };
