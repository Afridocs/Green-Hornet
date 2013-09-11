var mongoose = require("mongoose");

var RecipientSchema = new mongoose.Schema({
	name: String,
	url: String,
	date_started: { 
		type: Date,
		default: Date.now
	}
});

var Recipient = mongoose.model("Recipient", RecipientSchema);

module.exports = {
	Model: Recipient
}