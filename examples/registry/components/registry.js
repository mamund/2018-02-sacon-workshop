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
    
  props = ["serviceURL","serviceName","profile","mediaType","healthTTL","renewTTL","dateCreated","dateUpdated"];
  elm = 'disco';

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
  item.profile = (entry.profile||"");
  item.mediaType = (entry.mediaType||"*/*");
  item.healthTTL = (entry.healthTTL||"60")*1000;
  
  if(item.serviceURL === "") {
    error += "Missing serviceURL ";
  }
  if(item.serviceName==="") {
    error += "Missing serviceName ";
  } 
  if(item.profile==="") {
    error += "Missing profile ";
  } 
  if(item.mediaType==="") {
    error += "Missing mediaType ";
  } 
  if(item.healthTTL==="") {
    error += "Missing healthTTL ";
  } 
  
  if(error.length!==0) {
    rtn = utils.exception(error);
  }
  else {
    rtn = storage(elm, 'add', utils.setProps(item,props));
  }
  
  return rtn;
}

function updateEntry(elm, id, note, props) {
  var rtn, check, item, error;
  
  error = "";
  check = storage(elm, 'item', id);
  if(check===null) {
    rtn = utils.exception("File Not Found", "No record on file", 404);
  }
  else {
    item = check;
    item.id = id;      
    item.title = (note.title===undefined?check.title:note.title);
    item.text = (note.text===undefined?check.text:note.text);
    item.assignedTask = check.assignedTask

    if(item.title === "") {
      error += "Missing Title ";
    }
    if(item.assignedTask==="") {
      error += "Missing Assigned Task ";
    } 
    if(component.task('exists', item.assignedTask)===false) {
      error += "Task ID not found. ";
    }  
    
    if(error!=="") {
      rtn = utils.exception(error);
    } 
    else {
      storage(elm, 'update', id, utils.setProps(item, props));
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

