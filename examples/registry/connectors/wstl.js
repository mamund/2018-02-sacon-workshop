/*******************************************************
 * service: disco registry
 * module: wstl connector
 * Mike Amundsen (@mamund)
 *******************************************************/

// handles HTTP resource operations 
var wstl = require('./../wstl.js');
var gTitle = "DISCO Registry"

module.exports = main;

function main(req, res, parts, respond) {
  switch (req.method) {
  case 'GET':
    sendPage(req, res, respond);
    break;
  default:
    respond(req, res, utils.errorResponse(req, res, 'Method Not Allowed', 405));
    break;
  }
}

function sendPage(req, res, respond) {
  var doc, coll, root, data, content, related;

  root = 'http://'+req.headers.host;
  coll = wstl.all();
  data = [];
  content = {};
  related = {};
  
  // compose graph 
  doc = {};
  doc.title = gTitle;
  doc.actions = coll;
  doc.content = content;
  doc.data =  data;
  doc.related = related;

  // send the graph
  respond(req, res, {
    code : 200,
    doc : {
      disco : doc
    }
  });
  
}

// EOF

