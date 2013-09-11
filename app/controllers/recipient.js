var ursa = require("ursa");
var assert = require("assert");
var mongoose = require("mongoose");
var Message = require("../models/message");

mongoose.connect('mongodb://localhost/greenhornet');

var db = mongoose.connection;
var connected = false;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	connected = true;
});

module.exports = {
	public_key: function(req, res, next) {
		assert(connected);
		//Generate a public key
		var keypair = ursa.generatePrivateKey();
		var public_pem = keypair.toPublicPem('utf8');
		var private_pem = keypair.toPrivatePem('utf8');
		//Save it
		message = new Message.Model({ private_key: private_pem });
		message.save();
		//Send it
		var message_id = message._id;
		res.send({ public_key: public_pem, message_id: message_id });
	},
	message: function(req, res, next) {
		//Recieve it
		var message_enc = req.params.message;
		var message_id = req.params.message_id;
		//Decode it
		Message.Model.findOne({ _id: mongoose.Types.ObjectId(message_id) }, function(err, message_rec) {
			var private_pem = message_rec.private_key;
			var private_key = ursa.createPrivateKey(private_pem);

			var message = private_key.decrypt(message_enc, 'base64', 'utf8');
			//Store it
			message_rec.message = message;
			message_rec.private_key = "";
			message_rec.date_message_received = Date.now();

			message_rec.save();
			//Ack
			res.send({ ack: true });
			
		});		
	}
}