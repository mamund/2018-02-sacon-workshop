/*******************************************
 local config file
********************************************/

// create node
var config = {}

// populate node
config.serviceName = "zip-server";
config.serviceURL = "http://localhost:8080/";

config.registerURL = "http://localhost:8282/reg/";
config.registerHost = "localhost";
config.registerPort = "8282";
config.registerPath = "/reg/";

config.renewTTL = 6000;
config.renewURL = "http://localhost:8282/renew/";
config.renewHost = "localhost";
config.renewPort = "8282";
config.renewPath = "/renew/";

config.unregisterURL = "http://localhost:8282/unreg/";
config.unregisterHost = "localhost";
config.unregisterPort = "8282";
config.unregisterPath = "/unreg/";

// publish node
module.exports = config;
