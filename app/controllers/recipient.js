var ursa = require("ursa");
var assert = require("assert");
var mongoose = require("mongoose");
var redis = require("redis");
var Message = require("../models/message");

mongoose.connect('mongodb://localhost/greenhornet');

var db = mongoose.connection;
var connected = false;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	connected = true;
});

var redisClient = redis.createClient();

module.exports = {
	public_key: function(req, res, next) {
		assert(connected);
		//Generate a public key
		var keypair = ursa.generatePrivateKey();
		var public_pem = keypair.toPublicPem('utf8');
		var private_pem = keypair.toPrivatePem('utf8');
		//Save it
		//Save the key in Mongo if we're not using Redis:
		//message = new Message.Model({ private_key: private_pem });
		//Don't save the key in Mongo if we're using Redis:
		message = new Message.Model();
		message.save();
		var message_id = message._id;
		//Save the key in Redis
		redisClient.set('message_' + message_id + '_pk', private_pem);
		//Send it
		res.send({ public_key: public_pem, message_id: message_id });
	},
	message: function(req, res, next) {
		//Recieve it
		var message_enc = req.params.message;
		var message_id = req.params.message_id;
		//Decode it
		Message.Model.findOne({ _id: mongoose.Types.ObjectId(message_id) }, function(err, message_rec) {
			//Private key in Mongo
			//var private_pem = message_rec.private_key;
			//Private key in Redis
			redisClient.get('message_' + message_id + '_pk', function(err, reply) {
				var private_pem = reply.toString();
			
				// console.log(private_pem);
				var private_key = ursa.createPrivateKey(private_pem);

				var message = private_key.decrypt(message_enc, 'base64', 'utf8');
				//Store it
				//message_rec.message = message;
				redisClient.set('message_' + message_id + '_msg', message);
				
				// message_rec.private_key = "";
				message_rec.date_message_received = Date.now();

				message_rec.save();
				redisClient.del('message_' + message_id + '_pk');
				//Ack
				res.send({ ack: true });
			});
			
		});		
	}
}