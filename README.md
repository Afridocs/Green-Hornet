Green Hornet is designed to secure communication between news organisations and whistleblowers that need protection. 

It consists of three parts: 
- A server hosted by Afridocs;
- A server at the news organisation's premesis;
- A client application.

The servers all work through an API, allowing for new clients or servers to be built and plugged into the architecture. All parts of the ecosystem are open source and free to run on your own, so you're not restricted to Afridocs' environment.

This project is currently in early-stage development, and not in any way ready for production at this point. If you are interested in contributing to the project, please feel free to fork it and send pull requests.

Green Hornet is an Afridocs project.

## Running the Green Hornet server

You can run the server component on Vagrant and VirtualBox. You can get Vagrant at http://www.vagrantup.com and VirtualBox at http://www.virtualbox.org. 

To get the server running, first clone it:

	git clone git@github.com:Afridocs/Green-Hornet.git

Change the the directory:
	
	cd Green-Hornet

and start the Vagrant server:

	vagrant up

Once it's up, you can SSH into the virtual server with:

	vagrant ssh

You can start the server by changing to the "app" directory and starting the Node.js server:

	cd app
	node server.js

Now you can browse to the server with your favourite browser at http://localhost:3000/. If you get an error message that looks like this: 

	{"code":"ResourceNotFound","message":"/ does not exist"}

then the server is running just fine. 

## Testing the Green Hornet server

So an error message isn't much help. You can however run the tests, which will simulate sending an encrypted message to the Green Hornet server, through to the publication, and the publication decrypting and storing the message. 

In another terminal, SSH into the Vagrant terminal again, and run the tests (with the server still running).

	cd app
	node test.js

You'll see it perform two tests, and hopefully declare that the tests PASSED.

## How it works

1. The whistleblower client tells the Green Hornet server that it wants to send a message to a publication, in our test environment called "test".
2. Green Hornet looks up the address of this "test" publication's server (in the test case, the same server), and tells the publication's server that it can expect an encrypted message.
3. The publication's server generates a public-private key pair, and a message ID. It then sends the message ID and the public key to the Green Hornet server. It keeps the private key, which is never moved over the network.
4. The Green Hornet server then passes that information to the whistleblower's client. The client uses the public key to encrypt the message, and then passes the encrypted message and the message ID to Green Hornet's server. The message is never sent over the network in the clear.
5. Green Hornet passes the encrypted message to the publication's server.
6. The message is decrypted on the publication's server.

The important stuff to note is that the Green Hornet server never sees an unencrypted message or a private key. Even though we broker all the information, we have no way of examining it. Also, all sensitive information is kept off of the network. 

It's also important to note that a new public-private key pair is generated for every message sent. That means that even if a key is compromised, it can only unencrypt a single message, instead of all messages. This is called "perfect forward" encryption. In an age where the NSA and others have the potential to store all network traffic until it has the means of decrypting keys, this is an important security measure.

## API documentation

Coming soon...