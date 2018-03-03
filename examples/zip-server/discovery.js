/********************************************
 discovery module
 handles advertisting, discovery, and renewal

*********************************************/

var http = require('http');
var settings = require('./discovery-settings.js');
var querystring = require('querystring');
var url = require('url');

// public settings for discovery
settings.registryID = null;

// register a service
function register(data) {
  var options, body, msg;

  if(!data) {
    data = {
    serviceName : settings.serviceName,
    serviceURL : settings.serviceURL,
    renewTTL : settings.renewTTL
    }
  }

  body = querystring.stringify(data); 
  report(`registering: ${body}`);
  
  options = {
    host: settings.registerHost,
    port: settings.registerPort,
    path: settings.registerPath,
    method: 'POST',
    headers: {
      'Content-Type':'application/x-www-form-urlencoded',
      'Accept':'application/json',
      'Content-Length':Buffer.byteLength(body)
    }
  }

  //try {
    var registryRequest = http.request(options, function(registryResponse) {
      registryResponse.setEncoding('utf8');
      registryResponse.on('data', function(chunk) {
        msg = JSON.parse(chunk);
        settings.registryID = msg.id;
        report(`registered: ${settings.registryID}`)
        setInterval(function(){renew()}, settings.renewTTL);
      });
    });

    registryRequest.on('error', (e) => {
      console.error(`problem with register request: ${e.message}`);
    });

    registryRequest.write(body);
    registryRequest.end();
  //}
  //catch (e) {}
} 

// renew a service
// defaults settings.registryID
function renew(data) {
  var body, options;

  if(!data) {
    data = {"registryID" : settings.registryID}
  };
  
  body = querystring.stringify(data); 
  report(`renewing: ${body}`);
  
  options = {
    host: settings.renewHost,
    port: settings.renewPort,
    path: settings.renewPath,
    method: 'POST',
    headers: {
      'Content-Type':'application/x-www-form-urlencoded',
      'Accept':'application/json',
      'Content-Length':Buffer.byteLength(body)
    }
  }
 
  try {  
    var registryRequest = http.request(options, function(registryResponse) {
      registryResponse.setEncoding('utf8');
      registryResponse.on('data', function(chunk) {
        report("renewed");
      });
    });
 
    registryRequest.on('error', (e) => {
      console.error(`problem with renew request: ${e.message}`);
    });

    registryRequest.write(body);
    registryRequest.end();  
  }
  catch (e) {
    // ignore
  }
}

// unregister a service
// data defaults to settings.registryID
function unregister(data) {
  var body, options;

  if(!data) {
    data = {"registryID" : settings.registryID}
  };
	
  body = querystring.stringify(data); 
  report(`unregistering: ${body}`);
  
  options = {
    host: settings.unregisterHost,
    port: settings.unregisterPort,
    path: settings.unregisterPath,
    method: 'POST',
    headers: {
      'Content-Type':'application/x-www-form-urlencoded',
      'Accept':'application/json',
      'Content-Length':Buffer.byteLength(body)
    }
  }
 
  try {  
    var registryRequest = http.request(options, function(registryResponse) {
      registryResponse.setEncoding('utf8');
      registryResponse.on('data', function(chunk) {
        report("unregistered");
      });
    });
    
    registryRequest.on('error', (e) => {
      console.error(`problem with unregister request: ${e.message}`);
    });

    registryRequest.write(body);
    registryRequest.end();  
  }
  catch (e) {
    // ignore
  }
}

// find a service
function find(data) {
  var body, options;
	
  body = querystring.stringify(data); 
  report(`finding: ${body}`);
  
  options = {
    host: settings.findHost,
    port: settings.findPort,
    path: settings.findPath,
    method: 'GET',
    headers: {
      'Accept':'application/json',
    }
  }
 
  try {  
    var registryRequest = http.request(options, function(registryResponse) {
      registryResponse.setEncoding('utf8');
      registryResponse.on('data', function(chunk) {
        msg = JSON.parse(chunk);
        settings.foundServices = msg; // this is a hack!
        report(`found: ${msg}`);

      });
    });

    registryRequest.on('error', (e) => {
      console.error(`problem with find request: ${e.message}`);
    });

    registryRequest.end();  
  }
  catch (e) {
    // ignore
  }
}

// bind requested service
function bind(data) { 
  var options, body, msg;
 
  body = querystring.stringify(data); 
  report(`binding: ${body}`);

  options = {
    host: config.registerHost,
    port: config.registerPort,
    path: config.registerPath,
    method: 'POST',
    headers: {
      'Content-Type':'application/x-www-form-urlencoded',
      'Accept':'application/json',
      'Content-Length':Buffer.byteLength(body)
    }
  }
 
  try {
    var registryRequest = http.request(options, function(registryResponse) {
      registryResponse.setEncoding('utf8');
      registryResponse.on('data', function(chunk) {
        msg = JSON.parse(chunk);
        config.bound = msg; // this is a hack!
        report(`bound: ${msg}`);
        
      });
    });

    registryRequest.on('error', (e) => {
      console.error(`problem with bind request: ${e.message}`);
    });

    registryRequest.write(body);
    registryRequest.end();
  }
  catch (e) {
    // ignore
  }
}

// publish functions
exports.settings = settings;
exports.register = register;
exports.renew = renew;
exports.unregister = unregister;
exports.find = find;
exports.bind = bind;

// local functions
function report(data) {
  if(settings.verbose===true) {
    console.log(data);
  }
}
