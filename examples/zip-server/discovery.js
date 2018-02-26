/********************************************
 discovery module
 handles advertisting, discovery, and renewal

*********************************************/

var http = require('http');
var config = require('./config.js');

// register a service
exports.register = function(options, data) {
  var body, msg, id;
 
  body = ""; 
  //try {
    var registryRequest = http.request(options, function(registryResponse) {
      registryResponse.setEncoding('utf8');
      registryResponse.on('data', function(chunk) {
        body += chunk;
      });
      registryResponse.on('end', function() {
          console.log(body);
          msg = JSON.parse(body);      
          console.log('msg');
          console.log(msg);
      });
      registryRequest.write(data);
      registryRequest.end();
    });
  //}
  //catch (e) {
  //  // ignore
  //}
  return msg;
} 

// renew a service
exports.renew = function(options, data) {

  try {  
    var registryRequest = http.request(options, function(registryResponse) {
      registryResponse.setEncoding('utf8');
      registryResponse.on('data', function(chunk) {
        // throw it away
      });
    });
    registryRequest.write(data);
    registryRequest.end();  
  }
  catch (e) {
    // ignore
  }
}


