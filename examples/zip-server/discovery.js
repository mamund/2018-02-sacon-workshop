/********************************************
 discovery module
 handles advertisting, discovery, and renewal

*********************************************/

var http = require('http');
var config = require('./config.js');

// register a service
exports.register = function(options, data) {

  var registryRequest = http.request(options, function(registryResponse) {
    registryResponse.setEncoding('utf8');
    registryResponse.on('data', function(chunk) {
      config.registryID = JSON.parse(chunk).id;
    });
  });
  registryRequest.write(data);
  registryRequest.end();
} 

// renew a service
exports.renew = function(options, data) {
  var registryRequest = http.request(options, function(registryResponse) {
    registryResponse.setEncoding('utf8');
    registryResponse.on('data', function(chunk) {
      // throw it away
    });
  });
  registryRequest.write(data);
  registryRequest.end();  
}


