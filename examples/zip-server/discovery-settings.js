/*******************************************
 discovery defaults/settings file
********************************************/

// create node
var settings = {}

// general settings
settings.verbose = true;
settings.registryID = null;
settings.renewTTL = 30000;

// your service identifiers
settings.serviceName = "zip-server";
settings.serviceURL = "http://localhost:8080/";

// the resgistry service endpoints
settings.registerURL = "http://localhost:8282/reg/";
settings.registerHost = "localhost";
settings.registerPort = "8282";
settings.registerPath = "/reg/";

settings.renewURL = "http://localhost:8282/renew/";
settings.renewHost = "localhost";
settings.renewPort = "8282";
settings.renewPath = "/renew/";

settings.unregisterURL = "http://localhost:8282/unreg/";
settings.unregisterHost = "localhost";
settings.unregisterPort = "8282";
settings.unregisterPath = "/unreg/";

settings.findURL = "http://localhost:8282/find/";
settings.findHost = "localhost";
settings.findPort = "8282";
settings.findPath = "/find/";

// publish node
module.exports = settings;
