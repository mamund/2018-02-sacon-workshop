/*******************************************************
 * HTML representor
 * Mike Amundsen (@mamund)
 *******************************************************/

module.exports = html;

// need to include forms and links here
function html(object, root) {
  var template, errpage, doc, s;
  
  // this is the standard HTML layout for this representor
  template =  '';
  template += '<!DOCTYPE html>';
  template += '<html>';
  template += '<head>';
  template += '  <title>{title}</title>'
  template += '  <link rel="stylesheet" type="text/css" href="/files/index.css" />';
  template += '</head>';
  template += '<body>';
  template += '<h1 id="title">{title}</h1>';
  template += '<div id="links">{links}</div>';
  template += '<div id="content">{content}</div>';
  template += '  <div id="formset" class="column">';
  template += '    <div id="forms">{forms}</div>';
  template += '  </div>';
  template += '<div id="data">';
  template += '  <div id="dataset" class="column">';
  template += '    <div id="items">{items}</div>';
  template += '  </div>';
  template += '</div>';
  template += '</div>';
  template += '</body>';
  template += '</html>';
  
  // this is the error HTML layout
  errpage =  '';
  errpage += '<!DOCTYPE html>';
  errpage += '<html>';
  errpage += '<head>';
  errpage += '  <title>ERROR</title>'
  errpage += '</head>';
  errpage += '<body>';
  errpage += '<div id="error" style="margin:1em; padding: 1em; border:5px solid red">{error}</div>';
  errpage += '</body>';
  errpage += '</html>';
  
 
  // load up the doc
  doc = template;
  
  // handle loaded transitions graph
  s="";
  for(s in object) {
    if(s==="error") {
      doc = errpage;
      doc = doc.replace("{error}",processError(object[s]));
    }
    else {
      doc = doc.replace(/{title}/g, object[s].title||"");
      doc = processPage(object[s], root, s, doc);
    }
  }
  return doc;
}


// all page elements
function processPage(data, root, s, doc) {
  var rtn;

  // links
  rtn = getLinks(data, root, "page");
  doc = doc.replace("{links}",rtn);
  
  // content
  rtn = getContent(data, root);
  doc = doc.replace('{content}',rtn);
  
  // items
  rtn = processItems(data, root);
  doc = doc.replace('{items}',rtn);
  
  // forms
  rtn = getForms(data.actions, root);
  doc = doc.replace("{forms}",rtn);
  
  return doc;
}

// static content
function getContent(data) {
  var rtn;
  
  if(data.content && data.content!==null) {
    rtn = data.content;
  }
  else {
    rtn = "";
  }
  return rtn;
}

// list of records/items
function processItems(data, root) {
  var rtn, i, x, z, items, item;
  
  z=0;
  rtn = "<div>";  
  
  // iterate through items
  if(data.data && data.data!==null && data.data.length!==0) {
    items = data.data;
    rtn += '<div>';
    for(i=0,x=items.length;i<x;i++) {
      item = items[i];
      
      rtn += '<div class="item">';
      
      // handle any item-level buttons
      rtn += '<div>'
      rtn += getItemActions(data.actions, item, "item");
      rtn += '</div>';
       
      // iterate through all the properties of an item
      rtn += '<table>';
      for(var prop in item) {
        rtn += '<tr class="item '+prop+'" >';
        rtn += '<th class="right aligned" style="text-transform:capitalize;">'+prop+'</th>';
        switch (prop) {
          case 'id':
            rtn += '<td class="value"><a href="'+root+'/find/?id='+item[prop]+'">'+item[prop]+'</td>';
            break;
          case 'serviceURL':
          case 'healthURL':
            rtn += '<td class="value"><a href="'+item[prop]+'">'+item[prop]+'</td>';
            break;
          default:
            rtn += '<td class="value">'+item[prop]+'</td>';      
        }
        rtn += '</tr>';
      } 
      
      // close up this item rendering
      rtn += '</table>';   
      rtn += '</div>';
    }
    rtn += "</div>";
  }
  
  rtn += "</div>";
  
  return rtn;
}

// input forms
function getForms(coll) {
  var i, x, z;
  
  rtn = "<div>";
  z=0;
  
  // find all the actions w/ "form" in the target
  if(coll && coll!==null && coll.length!==0) {
    for(i=0,x=coll.length;i<x;i++) {
      if(coll[i].target.indexOf("form")!==-1) {
        rtn += getForm(coll[i]);
      }
    }
  }
  
  rtn += "</div>";
    
  return rtn;
}


// form helper
function getForm(data, item, related) {
  var rtn, i, x, temp, type;
  
  // declare the form space
  rtn = '';
  rtn += '<form method="{method}" action="{action}" class="{className}">'
  rtn = rtn.replace(/{method}/g,(data.type==="safe"?"get":"post"));
  rtn = rtn.replace(/{action}/g,(data.href||"#"));
  rtn = rtn.replace(/{rel}/g,(data.rel||""));
  rtn = rtn.replace(/{className}/g,"form");
  if(item && item!==null) {
    rtn = rtn.replace(/{key}/g, (item.id||""));
  }
  rtn += '<fieldset>';
  rtn += '<legend>'+(data.prompt||data.name)+'</legend>';

  // if we have inputs, add them
  if(data.inputs) {
    for(i=0,x=data.inputs.length;i<x;i++) {
      type=false;
      temp = data.inputs[i];
      rtn += '<p class="field">';
      rtn += '<label>'+(temp.prompt||temp.name)+'</label>';
      
      // handle html input type
      if(temp.type && temp.type==="textarea") {
        rtn += '<textarea rows="3" type="text" name="{name}" class="{className}" {required} {readOnly} {pattern}>{value}</textarea>';      
        type=true;
      }
      if(type===false && temp.suggest) { 
        rtn += '<select name="{name}" class="ui dropdown {className}" {required} {readOnly} {pattern}>{suggest}</select>'
        type=true;
      }
      if(type===false) {
        rtn += '<input type="text" name="{name}" class="{className}" value="{value}" {required}" {readOnly} {pattern}"/>';
      }
      
      // update properties for the html input
      rtn = rtn.replace(/{name}/g, (temp.name||""));
      rtn = rtn.replace(/{className}/g, "value");
      rtn = rtn.replace(/{value}/g, ((item && item[temp.name]?item[temp.name]:(temp.value?temp.value.toString():""))));
      rtn = rtn.replace(/{required}/g,(temp.required===true?'required="true"':""));
      rtn = rtn.replace(/{pattern}/g,(temp.pattern?'pattern="'+temp.pattern+'"':""));
      rtn = rtn.replace(/{suggest}/g,(temp.suggest?getSuggest(temp.suggest, (item && item[temp.name]?item[temp.name]:""), related):""));
      if(temp.suggest) {
        rtn = rtn.replace(/{readOnly}/g,(temp.readOnly===true?"disabled":""));
      }
      else {
        rtn = rtn.replace(/{readOnly}/g,(temp.readOnly===true?"readOnly":""));
      }      
      rtn += "</p>";
    }
  }
  
  // add submit button and close up this form
  rtn += '<p class="field">';
  rtn += '<input type="submit" text="Submit"/>';
  rtn += '<input type="reset" text="Reset"/>';
  rtn += '</p>';
  rtn += '</fieldset>';
  rtn += '</form>';
  
  return rtn;
}


// error message
function processError(data) {
  var item, rtn;

  rtn = "";
  rtn += '<h1>Error</h1>'
  rtn += "<dl>";
  
  for(p in data) {
    rtn += "<dt>"+p+"</dt>";
    rtn += "<dd>"+data[p]+"</dd>";
  }  
  rtn += "</dl>";
  
  return rtn;
}

// link helper (for item links)
function getItemActions(coll, item, target) {
  var rtn, i, x, t;
  
  t = (target||"item");
  rtn = "";
  
  // iterate through actions w/ target containing selected word-part
  for(i=0, x=coll.length;i<x;i++) {
    if(coll[i].target && coll[i].target.indexOf(t)!==-1 && coll[i].type==="safe") {
      rtn += '<a href="{href}" rel="{rel}" class="{className}" title="{description}">{prompt}</a>';
      rtn = rtn.replace(/{href}/g, coll[i].href);
      rtn = rtn.replace(/{rel}/g, (coll[i].rel.join(" ")||"item"));
      rtn = rtn.replace(/{prompt}/g, (coll[i].prompt||coll[i].name));
      rtn = rtn.replace(/{description}/g, (coll[i].description||(coll[i].prompt||coll[i].name)));
      rtn = rtn.replace(/{className}/g, (coll[i].html && coll[i].html.className?coll[i].html.className:"item"));
      rtn = rtn.replace(/{key}/g, (item.id||""));
    }
  }
  
  return rtn;
}

// link helper (for page links)
function getLinks(data, root, target) {
  var rtn, i, x, t, coll;
  
  t = (target||"menu");
  
  rtn = "";
  rtn += '<div>';
  
  if(data.actions && data.actions!==null && data.actions.length!==0) {
    coll = data.actions;
    for(i=0,x=coll.length;i<x;i++) {
      switch(coll[i].type) {
        case "safe": { 
          if(!coll[i].inputs && coll[i].target.indexOf(t)!==-1) {
            rtn += '<li class="item">';
            rtn += '<a href="{href}" rel="{rel}">{prompt}</a>';
            rtn += '</li>';
            
            rtn = rtn.replace(/{href}/g, coll[i].href);
            rtn = rtn.replace(/{prompt}/g, coll[i].prompt);
            rtn = rtn.replace(/{rel}/g, coll[i].rel.join(" "));          
          }
        }
      }
    }
  }
  
  rtn += "</div>";
  
  return rtn;
}

// dropdown list helper
function getSuggest(suggest, value, related) {
  var rtn, i, x, val, txt, vprop, tprop, list;
  
  rtn = "";
  rtn += '<option value="">SELECT</option>';

  if(Array.isArray(suggest)===true) {
    // use supplied values
    for(i=0,x=suggest.length;i<x;i++) {
      val = (suggest[i].value||"");
      txt = (suggest[i].text||"");
      rtn += '<option value="{value}" {selected}>{text}</option>';
      rtn = rtn.replace(/{value}/g, (val?val:(txt?txt:"")));
      rtn = rtn.replace(/{text}/g, (txt?txt:(val?val:"")));
      rtn = rtn.replace(/{selected}/g, (value===val?"selected":""));      
    }
  }
  else {
    // use related data
    vprop = suggest.value;
    tprop = suggest.text;
    list = related[suggest.related]
    if(Array.isArray(list)===true) {
      for(i=0,x=list.length;i<x;i++) {
        val = (list[i][vprop]||"");
        txt = (list[i][tprop]||"");
        rtn += '<option value="{value}" {selected}>{text}</option>';
        rtn = rtn.replace(/{value}/g, (val?val:(txt?txt:"")));
        rtn = rtn.replace(/{text}/g, (txt?txt:(val?val:"")));
        rtn = rtn.replace(/{selected}/g, (value===val?"selected":""));      
      }
    }
  }
  return rtn;
}
