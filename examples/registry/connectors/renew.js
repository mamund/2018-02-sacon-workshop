/*******************************************************
 * service: disco registry
 * module: register connector
 * Mike Amundsen (@mamund)
 *******************************************************/

// handles HTTP resource operations 
var registry = require('./../components/registry.js');
var utils = require('./utils.js');
var wstl = require('./../wstl.js');
var gTitle = "DISCO Registry";

module.exports = main;

function main(req, res, parts, respond) {

  switch (req.method) {
  case 'GET':
    sendPage(req, res, respond);
    break;
  case 'POST':
  case 'PATCH':
    postRenew(req, res, respond);
    break;
  default:
    respond(req, res, utils.errorResponse(req, res, 'Method Not Allowed', 405));
    break;
  }
}

function postRenew(req, res, respond) {
  var body, doc, msg;

  body = '';
  
  // collect body
  req.on('data', function(chunk) {
    body += chunk;
  });

  // process body
  req.on('end', function() {
    try {
      msg = utils.parseBody(body, req.headers["content-type"]);
      msg.id = msg.registryID;
      msg.renewLastPing = new Date();
      doc = registry('update', msg.id, msg);
      
      if(doc && doc.type==='error') {
        doc = utils.errorResponse(req, res, doc.message, doc.code);
      }
    } 
    catch (ex) {
      doc = utils.errorResponse(req, res, 'Server Error', 500);
    }

    respond(req, res, {code:301, doc:(!doc?"":doc), 
      headers:{'location':'//'+req.headers.host+"/find/?id="+msg.id}
    });
  });
}

function sendPage(req, res, respond) {
  var doc, coll, root, data, related, content;

  root = 'http://'+req.headers.host;
  coll = [];
  data = [];
  related = {};
  content = "";
  
  coll = wstl.append({name:"dashboard",href:"/",rel:["self", "home", "dashboard", "collection"], root:root},coll);
  coll = wstl.append({name:"registerLink",href:"/reg/",rel:["create-form", "register", "reglink"], root:root},coll);
  coll = wstl.append({name:"unregisterLink",href:"/unreg/",rel:["delete-form", "unregister", "unreglink"], root:root},coll);
  coll = wstl.append({name:"renewLink",href:"/renew/",rel:["edit-form", "renew", "renewlink"], root:root},coll);
  coll = wstl.append({name:"findLink",href:"/find/",rel:["search", "find", "findlink"], root:root},coll);
  coll = wstl.append({name:"bindLink",href:"/bind/",rel:["search", "bind", "bindlink"], root:root},coll);

  coll = wstl.append({name:"renewForm", href:"/renew/",rel:["edit-form", "renew", "renewform"], root:root},coll);
  
  content =  '<div>';
  content += '<h2>Renew a Service</h2>';
  content += '</div>';
  
  // compose graph 
  doc = {};
  doc.title = gTitle;
  doc.data =  data;
  doc.actions = coll;
  doc.content = content;
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

