/*******************************************************
 * service: disco registry
 * module: internal utilities
 * Mike Amundsen (@mamund)
 *******************************************************/

var fs = require('fs');
var qs = require('querystring');
var folder = process.cwd() + '/files/';

// for handling hal-forms extension
var halFormType = "application/prs.hal-forms+json";
var sirenSopType = "application/prs.siren-sop+json";

// load up action map (for Siren)
var httpActions = {};
httpActions.append = "POST";
httpActions.partial = "PATCH";
httpActions.read = "GET";
httpActions.remove = "DELETE";
httpActions.replace = "PUT";

// map WeSTL actions to HTTP
exports.actionMethod = function(action, protocol) {
  var p = protocol||"http";
  var rtn = "GET";

  switch(p) {
    case "http":
      rtn = httpActions[action];
      break;
    default:
      rtn = "GET";
  }
  return rtn;
}

// only write 'known' properties for an item
exports.setProps = function(item, props) {
  var rtn, i, x, p;
    
  rtn = {};  
  for(i=0,x=props.length;i<x;i++) {
    p = props[i];
    rtn[p] = (item[p]||"");
  }
  return rtn;
}

// produce clean array of items
exports.cleanList = function(elm) {
  var coll;

  coll = [];
  if(Array.isArray(elm) === true) {
    coll = elm;
  }
  else {
    if(elm!==null) {
      coll.push(elm);
    }
  }

  return coll;
}

// craft an external error response (anything, really)
exports.errorResponse = function(req, res, msg, code, description) {
  var doc;

  doc = {};
  doc.error = {};
  doc.error.code = code;
  doc.error.message = msg;
  doc.error.url = 'http://' + req.headers.host + req.url;
  if (description) {
    doc.error.description = description;
  }

  return {
    code: code,
    doc: doc
  };
}

// simple file responder
//
// ASSUMES: 
// - only files to deal with are JS, CSS & HTML
// - all of them are in a single sub-folder (FILES)
// - NOTE: this is a *synch* routine w/o streaming
//
exports.file = function(req, res, parts, respond) {
  var body, doc, type;

  try {
    body = fs.readFileSync(folder + parts[1]);
    
    type = 'text/plain';
    if (parts[1].indexOf('.js') !== -1) {
      type = 'application/javascript';
    }
    if (parts[1].indexOf('.css') !== -1) {
      type = 'text/css';
    }
    if (parts[1].indexOf('.html') !== -1) {
      type = 'text/html';
    }
    if(req.headers["accept"].indexOf(halFormType)!==-1) {
      type = halFormType;
    }
    if(req.headers["accept"].indexOf(sirenSopType)!==-1) {
      type = sirenSopType;
    }
    
    respond(req, res, {
      code: 200,
      doc: body,
      headers: {
        'content-type': type
      },
      file: true
    });
  } catch (ex) {
    respond(req, res, this.errorResponse(req, res, "File Not Found", 404));
  }
}

// dispatch for parsing incoming HTTP bodies
// ALWAYS returns JSON NVP collection
//
exports.parseBody = function(body, ctype) {
  var msg;
  
  switch (ctype) {
    case "application/x-www-form-urlencoded":
      msg = qs.parse(body);
      break;
    case "application/vnd.collection+json":
      msg = cjBody(body);
      break;
    default:
      msg = JSON.parse(body);
      break;
  }
  return msg;
}

// process an incoming cj template body
exports.cjBody = cjBody;
function cjBody(body) {
  var rtn, data, i, x;
  
  rtn = {};
  data = null;
  body = JSON.parse(body);
  
  // if they include template...
  if(body.template && body.template.data) {
    data = body.template.data;
  }

  // if they only pass data array...
  if(data===null && body.data) {
    data = body.data;
  }

  // create nvp dictionary
  if(data!==null) {
    for(i=0,x=data.length;i<x;i++) {
      rtn[data[i].name]=data[i].value;
    }
  }
  
  return rtn;
}

// parse the querystring args
exports.getQArgs = getQArgs;
function getQArgs(req) {
  var q, qlist;
  
  qlist = null;
  q = req.url.split('?');
  if (q[1] !== undefined) {
    qlist = qs.parse(q[1]);
  }
  return qlist;
}

// craft an internal exception object
exports.exception = function(name, message, code) {
  var rtn = {};

  rtn.type = "error";
  rtn.name = (name||"Error");
  rtn.message = (message||rtn.name);
  rtn.code = (code||400);

  return rtn;
}

// EOF

