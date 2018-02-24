/*******************************************************
 * service: disco registry
 * module: wstl definition 
 * Mike Amundsen (@mamund)
 *******************************************************/

// library for managing the state transitions
// function set for finding transitions at runtime
// wstl-doc.js contains *all* possible state transitions

// load local westl document
var trans = require('./wstl-doc.js');

// low-level finder
exports.find = function(name) {
  var rtn, i, x;
 
  rtn = null;
  for(i=0,x=trans.length;i<x;i++) {
    if(trans[i].name===name) {
      rtn = trans[i];
      break;
    }
  }

  return rtn;
}

// make a base transition
// object = {name,href,rel[],root}
exports.make = function(object) {
  var rtn, name, rel, href, root;
  
  if(!object.name || object.name===null || object.name==="") {
    rtn = null;
  }
  else {
    name = object.name;
    root = object.root||"";
    href = object.href||"#";
    rel = object.rel||"";
    
    tran = this.find(name);
    if(tran!==null) {
      rtn = tran;
      rtn.href = root + href;
      rtn.rel = [];
      if(Array.isArray(rel)===true) {
        for(i=0,x=rel.length;i<x;i++) {
          rtn.rel.push((rel[i].indexOf('/')===0?root+rel[i]:rel[i]));
        }        
      }
      else {
        rtn.rel.push((rel.indexOf('/')===0?root+rel:rel));
      }
    }
    else {
      rtn = null;
    }
  }
  return rtn;
}

// append a base transition to a collection
exports.append = function(object, coll) {
  var trans;
  
  trans = this.make(object);
  if(trans!==null) {
    coll.splice(coll.length, 0, trans);
  }
  return coll;
}

// NOT USED
exports.findByTarget = function(val) {
  var coll, i, x;
 
  coll = [];
  for(i=0,x=trans.length;i<x;i++) {
    if(trans[i].target && trans[i].target.indexOf(val)!==-1) {
      coll.push(trans[i]);
    }
  }
 
  return coll;
}

exports.all = function all() {
  return trans;
}

// EOF

