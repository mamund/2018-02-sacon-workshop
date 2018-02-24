/*******************************************************
 * WeSTL JSON representor format (server)
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. King (2008)
 *******************************************************/

// WesTL JSON
// assumes internal format is wstl
module.exports = wstljson;

function wstljson(object) {
  var rtn;
  
  // emit the full internal representor graph
  rtn = {wstl : []}
  rtn.wstl.push(object)
  
  return JSON.stringify(rtn, null, 2);
}

// EOF

