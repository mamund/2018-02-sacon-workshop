/*******************************************************
 * service: disco registry
 * module: generic file data storage
 * Mike Amundsen (@mamund)
 *******************************************************/

/*
 - simple storage component writes files to disk
 - FOLDER is the collection (tasks, users, notes, etc.)
 - FILE is the record (stored as JSON object, w/ ID as filename)
 - CRUD style interface (list, item, add, update, remove)
 - "contains"-type filtering is supported, no sort or join
 - NOTE: all actions are *synchronous* 
*/

var fs = require('fs');
var folder = process.cwd() + '/data/';
var utils = require('./connectors/utils.js');

module.exports = main;

function main(object, action, arg1, arg2, arg3) {
  var rtn;

  switch (action) {
  case 'list':
    rtn = getList(object);
    break;
  case 'filter':
    rtn = getList(object, arg1);
    break;
  case 'item':
    rtn = getItem(object, arg1);
    break;
  case 'add':
    rtn = addItem(object, arg1, arg2);
    break;
  case 'update':
    rtn = updateItem(object, arg1, arg2, arg3);
    break;
  case 'remove':
    rtn = removeItem(object, arg1);
    break;
  default:
    rtn = null;
    break;
  }
  return rtn;
}

function getList(object, filter) {
  var coll, item, list, i, x, t, name;

  coll = [];
  try {
    list = fs.readdirSync(folder + object + '/');
    for (i = 0, x = list.length; i < x; i++) {
      item = JSON.parse(fs.readFileSync(folder + object + '/' + list[i]));
      if (filter) {
        t = null;
        for (var name in filter) {
          if(filter[name].toString().length!==0) {
            try {
              if (item[name].toString().toLowerCase().indexOf(filter[name].toString().toLowerCase()) !== -1) { 
                t = list[i];
              } else {
                t = null;
              }
            } catch (err) {
              t = null;
            }
          }
        }
        if (t !== null) {
          coll.push(item);
        }
      } else {
        coll.push(item);
      }
    }
  } catch (ex) {
    coll = [];
  }

  return coll;
}

function getItem(object, id) {
  var rtn;

  try {
    rtn = JSON.parse(fs.readFileSync(folder + object + '/' + id));
  } catch (ex) {
    rtn = null;
  }

  return rtn;
}

function addItem(object, item, id) {
  var rtn;

  if (id) {
    item.id = id;
  } else {
    item.id = makeId();
  }
  item.dateCreated = new Date();
  item.dateUpdated = item.dateCreated;

  if (fs.existsSync(folder + object + '/' + item.id)) {
    rtn = utils.exception("DISCO", "Record already exists");
  } else {
    try {
      fs.writeFileSync(folder + object + '/' + item.id, JSON.stringify(item));
      rtn = getItem(object, item.id);
    } catch (ex) {
      rtn = null;
    }
  }
  return rtn;
}

function updateItem(object, id, item) {
  var current, rtn;

  current = getItem(object, id);
  if (!current) {
    rtn = utils.exception("DISCO", "Invalid [id]", 400);
    return rtn;
  }
   
  current = item;
  current.dateUpdated = new Date();
  
  rtn = null;
  try {
    fs.writeFileSync(folder + object + '/' + id, JSON.stringify(current));
    rtn = getItem(object, id);
  } catch (ex) {
    rtn = null;
  }

  return rtn;
}

function removeItem(object, id) {
  var rtn;

  try {
    fs.unlinkSync(folder + object + '/' + id);
    rtn = getList(object);
  } catch (ex) {
    rtn = getList(object);
  }
  return rtn;
}

function makeId() {
  var rtn;

  rtn = String(Math.random());
  rtn = rtn.substring(2);
  rtn = parseInt(rtn).toString(36);

  return rtn;
}

// EOF

