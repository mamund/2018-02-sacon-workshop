/*******************************************************
 * cj-client HTML/SPA client engine
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. King (2008)
 *
 * UI work
 * Benjamin Young (@bigbluehat)
 * Soundtrack : Burn the Clock : Adam Freeland (2003)
 *******************************************************/

/*  
  NOTE:
  - has fatal dependency on dom-help.js
  - uses no external libs/frameworks
  - built/tested for chrome browser (YMMV on other browsers)
  - designed to act as a "validator" for a human-driven Cj client.
  - not production robust (missing error-handling, perf-tweaking, etc.)
  - supports the following cj extensions:
    + collection.content
    + collection.related
    + collection.title
    + items.readonly
    + data.display
    + data.pattern
    + data.type
    + data.suggest (type 1 & 2)
*/

function cj() {

  var d = domHelp();  
  var g = {};
  
  g.url = '';
  g.cj = null;
  g.ctype = "application/vnd.collection+json";

  // init library and start
  function init(url, title) {
    if(!url || url==='') {
      alert('*** ERROR:\n\nMUST pass starting URL to the Cj library');
    }
    else {
      g.url = url;
      g.title = title||"Cj Client";
      req(g.url,"get");
    }
  }

  // primary loop
  function parseCj() {
    dump();
    title();
    content();
    links();
    items();
    queries();
    template();
    error();
    cjClearEdit();
  }

  // handle response dump
  function dump() {
    var elm = d.find("dump");
    elm.innerText = JSON.stringify(g.cj, null, 2);
  }
  
  // handle title
  function title() {
    var elm, str;

    if(hasTitle(g.cj.collection)===true) {
      str = g.cj.collection.title||g.title;
      elm = d.find("title");
      elm.innerText = str;
      elm = d.tags("title");
      elm[0].innerText = str;
    }
  }

  // handle content block
  function content() {
    var elm;

    elm = d.find("content");
    d.clear(elm);
    if(g.cj.collection.content && (typeof g.cj.collection.content)==="string") {
      elm.innerHTML = g.cj.collection.content.toString(); 
    }
  }
  
  // handle link collection
  function links() {
    var elm, coll;
    var menu, item, a, img;
    var head, lnk;
    
    elm = d.find("links");
    d.clear(elm);
    if(g.cj.collection.links) {
      coll = g.cj.collection.links;
      menu = d.node("div");
      menu.className = "ui blue fixed top menu";
      menu.onclick = httpGet;
      
      for(var link of coll) {

        // stuff render=none Cj link elements in HTML.HEAD
        if(isHiddenLink(link)===true) {
          head = d.tags("head")[0];
          lnk = d.link({rel:link.rel,href:link.href,title:link.prompt});
          d.push(lnk,head);
          continue;
        }
        
        // render embedded images, if asked
        if(isImage(link)===true) {
          item = d.node("div");
          item.className = "item";
          img = d.image({href:link.href,className:link.rel});
          d.push(img, item);
          d.push(item, menu);
        }
        else {
          a = d.anchor({rel:link.rel,href:link.href,text:link.prompt,
            className: "item"});
          d.push(a, menu);
        }
      }
      d.push(menu, elm);
    }
  }

  // handle item collection
  function items() {
    var elm, coll;
    var ul, li;
    var segment, buttons, table;
    var p, img, a;

    elm = d.find("items");
    d.clear(elm);
    if(g.cj.collection.items) {
      coll = g.cj.collection.items;
      ul = d.node("div");

      for(var item of coll) {
        segment = d.node("div");
        segment.className = "ui segment";
        buttons = d.node("div");
        buttons.className = "ui mini buttons";
        
        // item link
        a = d.anchor(
          {
            href:item.href,
            rel:item.rel,
            className:"item link ui basic blue button",
            text:item.prompt||"Read"
          }
        );
        a.onclick = httpGet;
        d.push(a,buttons);
        
        // edit link
        if(isReadOnly(item)===false && hasTemplate(g.cj.collection)===true) {
          a = d.anchor(
            {
              href:item.href,
              rel:"edit",
              className:"item action ui positive button",
              text:"Edit"
            }
          );
          a.onclick = cjEdit;
          d.push(a, buttons);
        }

        // delete link
        if(isReadOnly(item)===false) {
          a = d.anchor(
            {
              href:item.href,
              className:"item action ui negative button",
              rel:"delete",
              text:"Delete"
            }
          );
          a.onclick = httpDelete;
          d.push(a,buttons);
        }

        d.push(buttons,segment);

        if(item.links) {
          secondary_buttons = d.node("div");
          secondary_buttons.className = "ui mini buttons right floated";

          for(var link of item.links) {
            // render as images, if asked
            // TODO: test this with the new semantic-ui styling
            if(isImage(link)===true) {
              p = d.node("p");
              p.className = "ui basic button";
              img = d.image(
                {
                  className:"image "+link.rel,
                  rel:link.rel,
                  href:link.href
                }
              );         
              d.push(img, p);
              d.push(p,secondary_buttons);
            }
            else {
              a = d.anchor(
                {
                  className:"ui basic blue button",
                  href:link.href,
                  rel:link.rel,
                  text:link.prompt
                }
              );
              a.onclick = httpGet;
              d.push(a,secondary_buttons);
            }
          }
          d.push(secondary_buttons,segment);
        }

        d.push(segment,elm);

        table = d.node("table");
        table.className = "ui table";
        for(var data of item.data) {
          if(data.display==="true") {
            tr = d.data_row(
              {
                className:"item "+data.name,
                text:data.prompt+"&nbsp;",
                value:data.value+"&nbsp;"
              }
            );
            d.push(tr,table);
          }
        }
        d.push(table,segment);
      }
    }
    if (elm.hasChildNodes()) {
      elm.style.display = "block";
    } else {
      elm.style.display = "none";
    }
  }
  
  // handle query collection
  function queries() {
    var elm, coll;
    var segment;
    var form, fs, header, p, lbl, inp;

    elm = d.find("queries");
    d.clear(elm);
    if(g.cj.collection.queries) {
      coll = g.cj.collection.queries;
      for(var query of coll) {
        segment = d.node("div");
        segment.className = "ui segment";
        form = d.node("form");
        form.action = query.href;
        form.className = query.rel;
        form.method = "get";
        form.onsubmit = httpQuery;
        fs = d.node("div");
        fs.className = "ui form";
        header = d.node("div");
        header.innerHTML = query.prompt + "&nbsp;";
        header.className = "ui dividing header";
        d.push(header,fs);
        for(var data of query.data) {
          p = d.input(
            {
              prompt:data.prompt,
              name:data.name,
              value:data.value,
              required:data.required,
              readOnly:data.readOnly,
              pattern:data.pattern,
              type:data.type,
              max:data.max,
              min:data.min,
              maxlength:data.maxlength,
              size:data.size,
              step:data.step,
              suggest:data.suggest
            },
            (g.cj.collection.related?g.cj.collection.related:null)
          );
          d.push(p,fs);
        }
        p = d.node("p");
        inp = d.node("input");
        inp.type = "submit";
        inp.className = "ui mini submit button";
        d.push(inp, p, fs, form, segment, elm);
      }

      var wrapper = d.find("queries-wrapper");
      if (elm.hasChildNodes()) {
        wrapper.style.display = "block";
      } else {
        wrapper.style.display = "none";
      }
    }
  }
  
  // handle template object
  function template() {
    var elm, coll;
    var form, fs, header, p, lbl, inp;

    elm = d.find("template");
    d.clear(elm);
    if(hasTemplate(g.cj.collection)===true) {
      coll = g.cj.collection.template.data;
      form = d.node("form");
      form.action = g.cj.collection.href;
      form.method = "post";
      form.className = "add";
      form.onsubmit = httpPost;
      fs = d.node("div");
      fs.className = "ui form";
      header = d.node("div");
      header.className = "ui dividing header";
      header.innerHTML = g.cj.collection.template.prompt||"Add";
      d.push(header,fs);
      for(var data of coll) { 
        p = d.input(
          {
            prompt:data.prompt+"&nbsp;",
            name:data.name,
            value:data.value,
            required:data.required,
            readOnly:data.readOnly,
            pattern:data.pattern,
            type:data.type,
            max:data.max,
            min:data.min,
            maxlength:data.maxlength,
            size:data.size,
            step:data.step,
            cols:data.cols,
            rows:data.rows,
            suggest:data.suggest
          },
          (g.cj.collection.related?g.cj.collection.related:null)
        );
        d.push(p,fs);
      }
      p = d.node("p");
      inp = d.node("input");
      inp.className = "ui positive mini submit button";
      inp.type = "submit";
      d.push(inp, p, fs, form, elm);
    }

    if (elm.hasChildNodes()) {
      elm.style.display = "block";
    } else {
      elm.style.display = "none";
    }
  }
  
  // handle error object
  function error() {
    var elm, obj;

    elm = d.find("error");
    d.clear(elm);
    if(g.cj.collection.error) {
      obj = g.cj.collection.error;

      p = d.para({className:"title",text:obj.title});
      d.push(p,elm);

      p = d.para({className:"message",text:obj.message});
      d.push(p,elm);

      p = d.para({className:"code",text:obj.code});
      d.push(p,elm);

      p = d.para({className:"url",text:obj.url});
      d.push(p,elm);
    }
  }

  // ***************************
  // cj helpers
  // ***************************
  
  // render editable form for an item
  function cjEdit(e) {
    var elm, coll;
    var form, fs, header, p, lbl, inp;
    var data, item, dv, tx;
    
    elm = d.find("edit");
    d.clear(elm);
    
    // get data from selected item
    item = cjItem(e.target.href);
    if(item!==null) {
      form = d.node("form");
      form.action = item.href;
      form.method = "put";
      form.className = "edit";
      form.onsubmit = httpPut;
      fs = d.node("div");
      fs.className = "ui form";
      header = d.node("div");
      header.className = "ui dividing header";
      header.innerHTML = "Edit";
      d.push(header,fs);
      
      // get template for editing
      coll = g.cj.collection.template.data;
      for(var data of coll) {
        dv = cjData(item, data.name);
        tx=(dv!==null?dv.value+"":"");
        p = d.input(
          {
            prompt:data.prompt,
            name:data.name,
            value:tx,
            required:data.requried,
            readOnly:data.readOnly,
            pattern:data.pattern,
            type:data.type,
            max:data.max,
            min:data.min,
            maxlength:data.maxlength,
            size:data.size,
            step:data.step,
            cols:data.cols,
            rows:data.rows,
            suggest:data.suggest
          },
          (g.cj.collection.related?g.cj.collection.related:null)
        );
        d.push(p,fs);
      }
      p = d.node("p");
      inp = d.node("input");
      inp.className = "ui positive mini submit button";
      inp.type = "submit";
      d.push(inp, p, fs, form, elm);
      elm.style.display = "block";
    }
    return false;
  }
  function cjClearEdit() {
    var elm;
    elm = d.find("edit");
    d.clear(elm);
    elm.style.display = "none";
    return;
  }
  function hasTitle(collection) {
    return (collection.title && collection.title.length!==-1);
  }
  function hasTemplate(collection) {
    return (
      collection.template && 
      Array.isArray(collection.template.data)===true && 
      collection.template.data.length!==0
    );
  }
  function isHiddenLink(link) {
    var rtn = false;
    if(link.render && 
      (link.render==="none" || 
       link.render==="hidden" || 
       link.rel==="stylesheet")) 
    {
      rtn = true;
    }
    return rtn;
  }
  function isReadOnly(item) {
    var rtn = false;
    if(item.readOnly && (item.readOnly==="true" || item.readOnly===true)) {
      rtn = true;
    }
    return rtn;
  }
  function isImage(link) {
    var rtn = false;
    if(link.render && (link.render==="image" || link.render==="embed")) {
      rtn = true;
    }
    return rtn;
  }
  function cjItem(url) {
    var coll, rtn;
    
    rtn = null;
    coll = g.cj.collection.items;
    for(var item of coll) {
      if(item.href.replace('http:','').replace('https:','')===
        url.replace('http:','').replace('https:','')) {
        rtn = item;
        break;
      }
    }
    return rtn;
  }
  function cjData(item,name) {
    var coll, rtn;
    
    rtn = null;
    coll = item.data;
    for(var data of coll) {
      if(data.name === name) {
        rtn = data;
        break;
      }
    }
    return rtn;
  }
  
  // ********************************
  // ajax helpers
  // ********************************
  
  // mid-level HTTP handlers
  function httpGet(e) {
    if (undefined !== e.target.href) {
      req(e.target.href, "get", null);
    }
    return false;
  }
  function httpQuery(e) {
    var form, coll, query, i, x, q;

    q=0;
    form = e.target;
    query = form.action+"/?";
    nodes = d.tags("input", form);
    for(i=0, x=nodes.length;i<x;i++) {
      if(nodes[i].name && nodes[i].name!=='') {
        if(q++!==0) {
          query += "&";
        }
        query += nodes[i].name+"="+escape(nodes[i].value);
      }
    }
    req(query,"get",null);
    return false;
  }
  function httpPost(e) {
    var form, nodes, data;

    data = [];
    form = e.target;
    nodes = d.tags("input",form);
    for(i=0,x=nodes.length;i<x;i++) {
      if(nodes[i].name && nodes[i].name!=='') {
        data.push({name:nodes[i].name,value:nodes[i].value+""});
      }
    }
    nodes = d.tags("textarea",form);
    for(i=0,x=nodes.length;i<x;i++) {
      if(nodes[i].name && nodes[i].name!=='') {
        data.push({name:nodes[i].name,value:nodes[i].value+""});
      }
    }
    nodes = d.tags("select",form);
    for(i=0,x=nodes.length;i<x;i++) {
      if(nodes[i].name && nodes[i].name!=='') {
        data.push({name:nodes[i].name,value:nodes[i].value+""});
      }
    }
    req(form.action,'post',JSON.stringify({template:{data:data}}));
    return false;
  }
  function httpPut(e) {
    var form, nodes, data;

    data = [];
    form = e.target;
    nodes = d.tags("input",form);
    for(i=0,x=nodes.length;i<x;i++) {
      if(nodes[i].name && nodes[i].name!=='') {
        data.push({name:nodes[i].name,value:nodes[i].value+""});
      }
    }
    nodes = d.tags("textarea",form);
    for(i=0,x=nodes.length;i<x;i++) {
      if(nodes[i].name && nodes[i].name!=='') {
        data.push({name:nodes[i].name,value:nodes[i].value+""});
      }
    }
    nodes = d.tags("select",form);
    for(i=0,x=nodes.length;i<x;i++) {
      if(nodes[i].name && nodes[i].name!=='') {
        data.push({name:nodes[i].name,value:nodes[i].value+""});
      }
    }
    
    req(form.action,'put',JSON.stringify({template:{data:data}}));
    return false;
  }
  function httpDelete(e) {
    if(confirm("Ready to delete?")===true) {
      req(e.target.href, "delete", null);
    }
    return false;
  }
  // low-level HTTP stuff
  function req(url, method, body) {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function(){rsp(ajax)};
    ajax.open(method, url);
    ajax.setRequestHeader("accept",g.ctype);
    if(body && body!==null) {
      ajax.setRequestHeader("content-type", g.ctype);
    }
    ajax.send(body);
  }
  function rsp(ajax) {
    if(ajax.readyState===4) {
      g.cj = JSON.parse(ajax.responseText);
      parseCj();
    }
  }

  // export function
  var that = {};
  that.init = init;
  return that;
}

// *** EOD ***
