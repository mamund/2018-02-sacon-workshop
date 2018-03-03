/*******************************************
 discovery defaults/settings file
********************************************/

// create node
var settings = {}

// general settings
settings.verbose = true;
settings.registryID = null;
settings.renewTTL = 30000;
settings.contentType = "application/x-www-form-urlencoded";
settings.acceptType = "application/json";

// your service identifiers
settings.serviceName = "zip-server";
settings.serviceURL = "http://localhost:8080/";

// the registry service endpoints
settings.registerURL = "http://localhost:8282/reg/";
settings.renewURL = "http://localhost:8282/renew/";
settings.unregisterURL = "http://localhost:8282/unreg/";
settings.findURL = "http://localhost:8282/find/";
settings.bindURL = "http://localhost:8282/bind/";

// publish node
module.exports = settings;
