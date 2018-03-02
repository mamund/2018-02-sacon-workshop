/********************************************
 discovery module
 handles advertisting, discovery, and renewal

*********************************************/

var http = require('http');
var config = require('./config.js');
var querystring = require('querystring');
var url = require('url');

// register a service
exports.register = function(data) {
  var options, body, msg;
   
  body = querystring.stringify(data); 

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
        config.registryID = msg.id;
      });
    });

    registryRequest.on('error', (e) => {
      console.error(`problem with register request: ${e.message}`);
    });

    registryRequest.write(body);
    registryRequest.end();
  }
  catch (e) {
    // ignore
  }
} 

// renew a service
exports.renew = function(data) {
  var body, options;

  body = querystring.stringify(data); 
  
  options = {
    host: config.renewHost,
    port: config.renewPort,
    path: config.renewPath,
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
        // throw it away
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
exports.unregister = function(data) {
  var body, options;
	
  body = querystring.stringify(data); 
  
  options = {
    host: config.unregisterHost,
    port: config.unregisterPort,
    path: config.unregisterPath,
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
        // throw it away
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
exports.find = function(data) {
  var body, options;
	
  body = querystring.stringify(data); 
  
  options = {
    host: config.findHost,
    port: config.findPort,
    path: config.findPath,
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
        config.foundServices = msg; // this is a hack!
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

exports.bind = function(data) { 
  var options, body, msg;
   
  body = querystring.stringify(data); 

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
