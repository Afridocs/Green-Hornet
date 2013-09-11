var mongoose = require("mongoose");

var MessageSchema = new mongoose.Schema({
	private_key: String,
	message: String,
	date_keygen: { 
		type: Date,
		default: Date.now
	},
	date_message_received: {
		type: Date
	}
});

var Message = mongoose.model("Message", MessageSchema);

module.exports = {
	Model: Message
}