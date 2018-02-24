/*******************************************
 service: zip-consumer
 passes a single value to zip-server
 expects plain/text 
 returns results to caller
********************************************/

// requiring the HTTP interfaces in node 
var http = require('http'); 
var url = require('url');

// shared vars
var g = {};
g.zipServerURL = 'http://localhost:8080/';

// create an http server to handle requests and response 
http.createServer(function (req, res) {

  var qs = url.parse(req.url).search;
  
  // set up a request to remote service
  http.get(g.zipServerURL+qs, function(rsp) {
    rsp.setEncoding('utf8');
    var cType = rsp.headers["content-type"];
    var body = '';
    rsp.on("data", function(data){body += data});
    rsp.on("end", function() {
      res.writeHead(200, {'Content-Type': cType});
      res.end(body);
    });
  }).on("error", function(e) {
    res.writeHead(400, {'Content-Type':'text/plain'});
    res.end('FALSE\n');
  }); 
}).listen(8083); 

console.log('zip-consumer running on port 8083.');
