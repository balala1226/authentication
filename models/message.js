const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    user: { type: Schema.ObjectId, ref: "User", required: true },  
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
});

// Export model.
module.exports = mongoose.model("Message", MessageSchema);
