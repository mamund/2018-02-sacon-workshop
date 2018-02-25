/*******************************************************
 * DISCO - Discover service
 * registry middleware component (server)
 * Mike Amundsen (@mamund)
 *******************************************************/

var storage = require('./../storage.js');
var utils = require('./../connectors/utils.js');

module.exports = main;

// app-level actions for tasks
function main(action, args1, args2, args3) {
  var name, rtn, props;

  elm = 'disco';
    
  props = [
    "id",
    "serviceURL",
    "serviceName",
    "semanticProfile",
    "requestMediaType",
    "responseMediaType",
    "healthURL",
    "healthTTL",
    "healthLastPing",
    "renewTTL",
    "renewLastPing",
    "tags",
    "dateCreated",
    "dateUpdated"
  ];

  switch (action) {
    case 'exists':
      rtn = (storage(elm, 'item', args1)===null?false:true);
      break;
    case 'props' :
      rtn = utils.setProps(args1,props);
      break;  
    case 'profile':
      rtn = profile;
      break;
    case 'list':
      rtn = utils.cleanList(storage(elm, 'list'));
      break;
    case 'read':
      rtn = utils.cleanList(storage(elm, 'item', args1));
      break;
    case 'filter':
      rtn = utils.cleanList(storage(elm, 'filter', args1));
      break;
    case 'add':
      rtn = addEntry(elm, args1, props);
      break;
    case 'update':
      rtn = updateEntry(elm, args1, args2, props);
      break;
    case 'remove':
      rtn = removeEntry(elm, args1, args2, props);
      break;
    default:
      rtn = null;
      break;
  }
  return rtn;
}

function addEntry(elm, entry, props) {
  var rtn, item, error;
  
  error = "";
  
  item = {}
  item.serviceURL = (entry.serviceURL||"");
  item.serviceName = (entry.serviceName||"");
  item.semanticProfile = (entry.semanticProfile||"");
  item.requestMediaType = (entry.requestMediaType||"*/*");
  item.responseMediaType = (entry.responseMediaType||"*/*");
  item.healthURL = (entry.healthURL||"");
  item.healthTTL = (entry.healthTTL||"60000");
  item.healthLastPing = (entry.healthLastPing||"");
  item.renewTTL = (entry.renewTTL||"600000");
  item.renewLastPing = (entry.renewLastPing||"");
  item.tags = (entry.tags||"");
  
  if(item.serviceURL === "") {
    error += "Missing serviceURL ";
  }
  if(item.serviceName === "") {
    error += "Missing serviceName ";
  } 
  
  if(error.length!==0) {
    rtn = utils.exception(error);
  }
  else {
    rtn = storage(elm, 'add', utils.setProps(item,props));
  }
  
  return rtn;
}

function updateEntry(elm, id, entry, props) {
  var rtn, check, item, error;

  error = "";
  check = storage(elm, 'item', id);  
  if(check===null) {
    rtn = utils.exception("File Not Found", "No record on file", 404);
  }
  else {
    item = check;
    item.serviceURL = (entry.serviceURL===undefined?check.serviceURL:entry.serviceURL);
    item.serviceName = (entry.serviceName===undefined?check.serviceName:entry.serviceName);
    item.semanticProfile = (entry.semanticProfile===undefined?check.semanticProfile:entry.semanticProfile);
    item.requestMediaType = (entry.requestMediaType===undefined?check.requestMediaType:entry.requestMediaType);
    item.responseMediaType = (entry.responseMediaType===undefined?check.responseMediaType:entry.responseMediaType);
    item.healthURL = (entry.healthURL===undefined?check.healthURL:entry.healthURL);
    item.healthTTL = (entry.healthTTL===undefined?check.healthTTL:entry.healthTTL);
    item.healthLastPing = (entry.healthLastPing===undefined?check.healthListPing:entry.healthLastPing);
    item.renewTTL = (entry.renewTTL===undefined?check.renewTTL:entry.renewTTL);
    item.renewLastPing = (entry.renewLastPing===undefined?check.renewLastPing:entry.renewLastPing);
    item.tags = (entry.tags===undefined?check.tags:entry.tags);
    
    if(item.serviceURL === "") {
      error += "Missing serviceURL ";
    }
    if(item.serviceName === "") {
      error += "Missing serviceName ";
    } 
      
    if(error!=="") {
      rtn = utils.exception(error);
    } 
    else {
      rtn = storage(elm, 'update', id, utils.setProps(item, props));
    }
  }
  
  return rtn;
}

function removeEntry(elm, id) {
  var rtn, check;
  
  check = storage(elm, 'item', id);
  if(check===null) {
    rtn = utils.exception("File Not Found", "No record on file", 404);
  }
  else {
    storage(elm, 'remove', id);
  }
  
  return rtn;
  
}
// EOF

