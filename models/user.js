const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isPremiumMember: { type: Boolean, required: true },
    isAdmin: { type: Boolean, required: true }
});

// Virtual for this user URL.
UserSchema.virtual("url").get(function () {
  return "/user/" + this._id;
});

// Export model.
module.exports = mongoose.model("User", UserSchema);
