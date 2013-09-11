var restify = require('restify');
var assert = require('assert');
var fs = require("fs");
var ursa = require("ursa");

var client = restify.createJsonClient({
	url: 'http://localhost:3000'
});

client.post("/api/public_key", { recipient_id: "test" }, function(err, req, res, obj) {
	console.log("Testing /api/public_key with data 'test'");
	assert.ifError(err);
	assert(obj.public_key, "Response parameter public_key missing");
	assert(obj.message_id, "Response parameter message_id missing");
	console.log('%d -> %j', res.statusCode, res.headers);
	console.log('%j', obj);
	console.log("PASSED");

	var message = fs.readFileSync("./data/message.txt");

	var message_id = obj.message_id;

	var pub = ursa.createPublicKey(obj.public_key );

	var message_enc = pub.encrypt(message, 'utf8', 'base64');

	client.post("/api/message", { recipient_id: "test", message_id: message_id, message: message_enc }, function(err, req, res, obj) {
		console.log("Testing /api/message with data recipient_id, message_id, message");
		assert.ifError(err);
		assert(obj.ack, "Response parameter ack missing");
		console.log('%d -> %j', res.statusCode, res.headers);
		console.log('%j', obj);
		console.log("PASSED");
	});
});

