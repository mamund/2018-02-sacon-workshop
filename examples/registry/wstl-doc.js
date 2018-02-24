/***********************************
 discovery westl document
 ***********************************/

var wstl = [
  {
    name : "dashboard",
    type : "safe",
    action : "read",
    kind : "disco",
    target : "html link page",
    prompt : "Dashboard"
  },
  {
    name : "itemLink",
    type : "safe",
    action : "read",
    kind : "disco",
    target : "html link page",
    prompt : "Get Item"
  },
  {
    name : "itemForm",
    type : "safe",
    action : "read",
    kind : "disco",
    target : "html form",
    prompt : "Get Item",
    inputs : [
      {name : "registryID", prompt : "Registry ID", value : "", required:true}
    ]
  },
  {
    name : "registerLink",
    type : "safe",
    action : "read",
    kind : "disco",
    target : "html link page",
    prompt : "Register a Service",
  },
  {
    name : "registerForm",
    type : "unsafe",
    action : "add",
    kind : "disco",
    target : "html form",
    prompt : "Register a Service",
    inputs : [
      {name : "serviceURL", prompt : "Service URL", value : "", required:true},
      {name : "serviceName", prompt : "Service Name", value : "", required:true},
      {name : "profile", prompt : "Profiles", value : "", required:true},
      {name : "mediaType", prompt : "Media Types", value : "", required:true},
      {name : "pingTTL", prompt : "Ping (sec)", value : "30", required:false},
    ]
  },
  {
    name : "unregisterLink",
    type : "safe",
    action : "read",
    kind : "disco",
    target : "html link page",
    prompt : "Unregister a Service",
  },
  {
    name : "unregisterForm",
    type : "unsafe",
    action : "remove",
    kind : "disco",
    target : "html form",
    prompt : "Unregister a Service",
    inputs : [
      {name : "registryID", prompt : "Registry ID", value : "", required:true},
    ]
  },
  {
    name : "renewLink",
    type : "safe",
    action : "read",
    kind : "disco",
    target : "html link page",
    prompt : "Renew a Service",
  },
  {
    name : "renewForm",
    type : "unsafe",
    action : "update",
    kind : "disco",
    target : "html form",
    prompt : "Renewal Form",
    inputs : [
      {name : "registryID", prompt : "Registry ID", value : "", required : true}
    ]
  },  
  {
    name : "healthLink",
    type : "safe",
    action : "read",
    kind : "disco",
    target : "html link page",
    prompt : "Send Health Check to a Service",
  },
  {
    name : "healthForm",
    type : "unsafe",
    action : "add",
    kind : "disco",
    target : "html form",
    prompt : "Health Check Form",
    inputs : [
      {name : "registryID", prompt : "Registry ID", value : "", required:true},
    ]
  },
  {
    name : "findLink",
    type : "safe",
    action : "read",
    kind : "disco",
    target : "html link page",
    prompt : "Find a Service",
  },
  {
    name : "findForm",
    type : "safe",
    action : "read",
    kind : "disco",
    target : "html form",
    prompt : "Find a Service",
    inputs : [
      {name : "serviceURL", prompt : "Service URL", value : ""},
      {name : "serviceName", prompt : "Service Name", value : ""},
      {name : "status", prompt : "Service Status", value : ""},
      {name : "profile", prompt : "Profiles", value : ""},
      {name : "mediaTGype", prompt : "Media Types", value : ""},
      {name : "pingTTL", prompt : "Ping(sec)", value : ""},
    ]
  },
  {
    name : "bindLink",
    type : "safe",
    action : "read",
    kind : "disco",
    target : "html link page",
    prompt : "Bind to a Service",
  },
  {
    name : "bindForm",
    type : "unsafe",
    action : "add",
    kind : "disco",
    target : "html form",
    prompt : "Bind to a Service",
    inputs : [
      {name : "registryID", prompt : "Registry ID", value : "", required:true},
    ]
  }  
]; 

module.exports = wstl;
