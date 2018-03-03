/*******************************************************
 * service: disco registry
 * module: unregister connector
 * Mike Amundsen (@mamund)
 *******************************************************/

// handles HTTP resource operations 
var wstl = require('./../wstl.js');
var utils = require('./utils.js');
var component = require('./../components/registry.js');

var gTitle = "DISCO Registry";

module.exports = main;

function main(req, res, parts, respond) {

  switch (req.method) {
  case 'GET':
    sendPage(req, res, respond, utils.getQArgs(req));
    break;
  default:
    respond(req, res, utils.errorResponse(req, res, 'Method Not Allowed', 405));
    break;
  }
}

function sendPage(req, res, respond, args) {
  var doc, coll, root, data, related, content;

  root = 'http://'+req.headers.host;
  coll = [];
  data = component('filter',args);
  related = {};
  content = "";
  
  coll = wstl.append({name:"dashboard",href:"/",rel:["self", "home", "dashboard", "collection"], root:root},coll);
  coll = wstl.append({name:"registerLink",href:"/reg/",rel:["create-form", "register", "reglink"], root:root},coll);
  coll = wstl.append({name:"unregisterLink",href:"/unreg/",rel:["delete-form", "unregister", "unreglink"], root:root},coll);
  coll = wstl.append({name:"renewLink",href:"/renew/",rel:["edit=form", "renew", "renewlink"], root:root},coll);
  coll = wstl.append({name:"findLink",href:"/find/",rel:["search", "find", "findlink"], root:root},coll);
  coll = wstl.append({name:"bindLink",href:"/bind/",rel:["search", "bind", "bindlink"], root:root},coll);
  
  coll = wstl.append({name:"findForm", href:"/find/",rel:["search", "find", "findform"], root:root}, coll);
  
  content =  '<div>';
  content += '<h2>Find a Service</h2>';
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

