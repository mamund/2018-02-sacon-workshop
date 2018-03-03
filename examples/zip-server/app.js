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

// share vars
var g = {};
g.compare = null; 
g.contentType = "";
g.defaultContentType = config.accept;
g.cacheControl = config.cacheControl;

/********************************************
FUN WITH DISCOVERY
** check details for discovery-settings.js **
- register (renewal is handled automatically)
- find (this sample just returns list)
- unregister (unreg on orderly shutdown)
  NOTE: this small service does not
        expose a health-check URL
********************************************/
// register this service w/ defaults
discovery.register(null, function(response) {

  // sample service discovery action
  discovery.find(null, function(data, response) {
  
    // select endpoints from query
    list = JSON.parse(data);
    if(list.disco.length!==0) {
      // launch http server
      http.createServer(zipServer).listen(8080); 
      console.info('zip-server running on port 8080.');      
    }
    else {
      console.error('unable to bind to dependent services');
      process.kill(process.pid, "SIGTERM");
    }    
  });
});

// set up proper shutdown
process.on('SIGTERM', function () {
  discovery.unregister(null, function(response) {
    try {  
      zipServer.close(function() {
      console.log('gracefully shutting down');
        process.exit(0);
      });
    } catch(e){}
  });
  setTimeout(function() {
    console.error('forcefully shutting down');
    process.exit(1);
  }, 10000);  
});

// http listener to handle requests and response 
function zipServer(req, res) {
  var found, value, image, status;
  
  // compute results
  g.compare = zipArg(req.url);
  g.contentType = mimeType(req.headers.accept||g.defaultContentType);
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
          'Cache-Control': g.cacheControl
      });
      res.end(image,'binary');
      break;
    case 'application/json':
      res.writeHead(status, 
        { 'Content-Type' : 'application/json', 
          'Cache-Control': g.cacheControl
      });
      res.end(JSON.stringify({zip:value})+'\n');
      break;
    default:
      res.writeHead(status,
        { 'Content-Type' : g.contentType, 
          'Cache-Control': g.cacheControl
      });  
      res.end(value+'\n');
  }
}

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


