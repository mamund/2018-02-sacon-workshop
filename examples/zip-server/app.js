/********************************************
 service: zipcode validator
 returns true/false on zipcode value
 - HTML response is 200OK + image file
 - TEXT response is 200OK true|false
 - JSON response is 200OK + {zip: true|false}
*********************************************/

// pull in modules
var http = require('http');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');
var discovery = require('./discovery.js');

// pull in local data
var config = require('./config.js');
var zipcodes = require('./zip-codes.js');
var registryID = '123';

// register this service
registerMe();

// set up renewal interval
setInterval(function(){renewMe()}, config.renewTTL);

// set up proper shutdown
process.on('SIGTERM', function () {
  server.close(unregisterMe());
});

// share vars
var g = {};
g.compare = null; 
g.contentType = 'text/plain';

// create an http server to handle requests and response 
http.createServer(function (req, res) {
  var found, value, image, status;
  
  // compute results
  g.compare = zipArg(req.url);
  g.contentType = mimeType(req.headers.accept||"text/plain");
  found = zipcodes.filter(isValid);
  
  // format response 
  value  = (found.length!==0).toString();
  status = (value==='true'?200:400);
  
  switch(g.contentType) {
    case 'text/html':
      fn = './'+value+'.png';
      image = fs.readFileSync(fn);
      res.writeHead(status, 
        { 'Content-Type' : 'image/png', 
          'Cache-Control': 'public,max-age=108000'
      });
      res.end(image,'binary');
      break;
    case 'application/json':
      res.writeHead(status, 
        { 'Content-Type' : 'application/json', 
          'Cache-Control': 'public,max-age=108000'
      });
      res.end(JSON.stringify({zip:value})+'\n');
      break;
    default:
      res.writeHead(status,
        { 'Content-Type' :'text/plain', 
          'Cache-Control': 'public,max-age=108000'
      });  
      res.end(value+'\n');
  }
}).listen(8080); 
console.log('zip-server running on port 8080.');

// array filter
function isValid(arg) {
  return arg.toString() === g.compare;
}

// querystring arg
function zipArg(arg) {
  var zip, rtn;
  
  zip = url.parse(arg).search;  
  if(zip!==null && zip.length>0) {
    rtn = zip.slice(1)
  }
  else {
    rtn = "";
  }  
  return rtn;
}

// incoming accept header
function mimeType(arg) {
  var rtn = '';
  
  if(arg.indexOf('application/json')!==-1) {
    rtn = 'application/json';
  }
  if(arg.indexOf('*/*')!==-1) {
    rtn = 'text/html';
  }
  if(arg.indexOf('html')!==-1) {
    rtn = 'text/html';
  }  
  if(rtn === '') {
    rtn = 'plain/text';
  }  
  
  return rtn;
}

// register this service
function registerMe() {
  
  var body = {
    serviceName : config.serviceName,
    serviceURL : config.serviceURL
  }
  console.log('register');
  discovery.register(body);
}

function renewMe() {
  
  var body = {registryID : config.registryID}
  console.log('renew');
  console.log(body);
  discovery.renew(body);
}

function unregisterMe() {

  var body = {registryID : config.registryID}
  console.log('unregister');
  console.log(data);
  discovery.unregister(body);

  process.exit(0);

}
