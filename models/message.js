const { Schema, model } = require("mongoose");

const requiredString = { type: String, required: true };

const messageSchema = new Schema({
	guildId: requiredString,
	message: requiredString,
});

module.exports = model("message", messageSchema);
