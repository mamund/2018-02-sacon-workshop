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

// single step does it all
// TODO
function findAndBind(data, cb) {
  // use find() method to get full URLs for all dependent services
  // use bind() to notify the registry you intended to use each dependent
  // use register() to add yourself to the registry (also handles renew)
  // if all goes well, execute the passed-in callback to continue
}

// register a service
function register(data, cb) {
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
    host: url.parse(settings.registerURL).hostname,
    port: url.parse(settings.registerURL).port,
    path: url.parse(settings.registerURL).pathname,
    method: 'POST',
    headers: {
      'Content-Type': settings.contentType,
      'Accept': settings.acceptType,
      'Content-Length':Buffer.byteLength(body)
    }
  }

  var registryRequest = http.request(options, function(registryResponse) {
    registryResponse.setEncoding('utf8');
    registryResponse.on('data', function(chunk) {
      msg = JSON.parse(chunk);
      settings.registryID = msg.id;
      report(`registered: ${settings.registryID}`)
      setInterval(function(){renew()}, settings.renewTTL);
      if(typeof cb === "function") {cb(registryResponse)}
    });
  });

  registryRequest.on('error', (e) => {
    console.error(`problem with register request: ${e.message}`);
  });

  registryRequest.write(body);
  registryRequest.end();
} 

// renew a service
// defaults settings.registryID
function renew(data, cb) {
  var body, options;

  if(!data) {
    data = {"registryID" : settings.registryID}
  };
  
  body = querystring.stringify(data); 
  report(`renewing: ${body}`);
  
  options = {
    host: url.parse(settings.renewURL).hostname,
    port: url.parse(settings.renewURL).port,
    path: url.parse(settings.renewURL).pathname,
    method: 'POST',
    headers: {
      'Content-Type': settings.contentType,
      'Accept': settings.acceptType,
      'Content-Length':Buffer.byteLength(body)
    }
  }
 
  var registryRequest = http.request(options, function(registryResponse) {
    registryResponse.setEncoding('utf8');
    registryResponse.on('data', function(chunk) {
      report("renewed");
      if(typeof cb === "function") {cb(registryResponse)}
    });
  });

  registryRequest.on('error', (e) => {
    console.error(`problem with renew request: ${e.message}`);
  });

  registryRequest.write(body);
  registryRequest.end();  
}

// unregister a service
// data defaults to settings.registryID
function unregister(data, cb) {
  var body, options;

  if(!data) {
    data = {"registryID" : settings.registryID}
  };
	
  body = querystring.stringify(data); 
  report(`unregistering: ${body}`);
  
  options = {
    host: url.parse(settings.unregisterURL).hostname,
    port: url.parse(settings.unregisterURL).port,
    path: url.parse(settings.unregisterURL).pathname,
    method: 'POST',
    headers: {
      'Content-Type': settings.contentType,
      'Accept': settings.acceptType,
      'Content-Length':Buffer.byteLength(body)
    }
  }
 
  var registryRequest = http.request(options, function(registryResponse) {
    registryResponse.setEncoding('utf8');
    registryResponse.on('data', function(chunk) {
      report("unregistered");
      if(typeof cb === "function") {cb(registryResponse)}
    });
  });
  
  registryRequest.on('error', (e) => {
    console.error(`problem with unregister request: ${e.message}`);
  });

  registryRequest.write(body);
  registryRequest.end();  
}

// find a service
function find(data, cb) {
  var body, options;
	
  body = querystring.stringify(data); 
  report(`finding: ${body}`);
  
  options = {
    host: url.parse(settings.findURL).hostname,
    port: url.parse(settings.findURL).port,
    path: url.parse(settings.findURL).pathname + (body===''?'':'?' + body),
    method: 'GET',
    headers: {
      'Accept':settings.acceptType,
    }
  }
 
  var registryRequest = http.request(options, function(registryResponse) {
    registryResponse.setEncoding('utf8');
    registryResponse.on('data', function(chunk) {
      report(`found: ${chunk}`);
      if(typeof cb === "function") {cb(chunk,registryResponse)}
    });
  });

  registryRequest.on('error', (e) => {
    console.error(`problem with find request: ${e.message}`);
  });

  registryRequest.end();  
}

// bind requested service
function bind(data, cb) { 
  var options, body, msg;
 
  body = querystring.stringify(data); 
  report(`binding: ${body}`);

  options = {
    host: url.parse(settings.bindURL).hostname,
    port: url.parse(settings.bindURL).port,
    path: url.parse(settings.bindURL).pathname,
    method: 'POST',
    headers: {
      'Content-Type': settings.contentType,
      'Accept': settings.acceptType,
      'Content-Length':Buffer.byteLength(body)
    }
  }
 
  var registryRequest = http.request(options, function(registryResponse) {
    registryResponse.setEncoding('utf8');
    registryResponse.on('data', function(chunk) {
      report(`bound: ${msg}`);
      if(typeof cb === "function") {cb(registryResponse)}      
    });
  });

  registryRequest.on('error', (e) => {
    console.error(`problem with bind request: ${e.message}`);
  });

  registryRequest.write(body);
  registryRequest.end();
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

function hpp(href) {
  url.parse(href);
 
  console.log(url.parse(href).hostname);
  console.log(url.parse(href).port);
  console.log(url.parse(href).path);
}
