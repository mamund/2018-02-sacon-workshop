/********************************************
 service: uuid-generator
 returns uuid string
 - TEXT response is 200OK + uuid
 - uses https://www.uuidgenerator.net/api
*********************************************/

// pull in modules
var http = require('http');
var https = require('https');
var discovery = require('./discovery.js');
var config = require('./config.js');

// local vars
var port = process.env.PORT||config.port;
var headers = { 
  'Content-Type':'text/plain', 
  'Cache-Control':'no-cache', 
  'Expires':'0'
};

// register this service w/ defaults
discovery.register(null, function(data, response) {
  http.createServer(uuidGenerator).listen(port); 
  console.info('uuid-generator running on port '+port+'.');      
});

// http listener to handle requests and response 
function uuidGenerator(req, res) {
  // set up a request to remote service
  https.get(config.uuid4URL, function(rsp) {
    rsp.setEncoding('utf8');
    var body = '';
    rsp.on("data", function(data){body += data});
    rsp.on("end", function() {
      res.writeHead(200, headers);
      res.end(body);
    });
  }).on("error", function(e) {
    res.writeHead(400, headers);
    res.end('');
  }); 
}

// set up proper discovery shutdown
process.on('SIGTERM', function () {
  discovery.unregister(null, function(response) {
    try {  
      uuidGenerator.close(function() {
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
