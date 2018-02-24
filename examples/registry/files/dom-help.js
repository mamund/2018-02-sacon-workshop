// ***************************************
// DOM helpers
// handy helper routines for HTML DOM work
// @mamund
// ***************************************
function domHelp() {

  // high-level helpers for HTML-DOM
  function para(args) {
    var p;
    
    p = node("p");
    p.className = args.className||"";
    p.innerHTML = args.text||"";

    return p;  
  }

  function option(args) {
    var opt;

    opt = node("option");
    opt.text = args.text||(args.value||"item");
    opt.value = args.value||(args.text||"");
    opt.className = args.className||"";

    return opt;
  }
  
  // text area control
  function area(args) {
    var p, lbl, inp;

    p = node("p");
    p.className = "inline field";
    lbl = node("label");
    inp = node("textarea");
    lbl.className = "data";
    lbl.innerHTML = args.prompt||"";
    inp.name = args.name||"";
    inp.className = "value "+ args.className;
    inp.innerText = args.value.toString()||"";
    inp.required = (args.required||false);
    inp.readOnly = (args.readOnly||false);
    if(args.pattern) {inp.pattern = args.pattern;}
    if(args.max) {inp.max = args.max;}
    if(args.min) {inp.min = args.min;}
    if(args.maxlength) {inp.maxlength = args.maxlength;}
    if(args.size) {inp.size = args.size;}
    if(args.step) {inp.step = args.step;}
    if(args.cols) {inp.cols = args.cols;}
    if(args.rows) {inp.rows = args.rows;}
    push(lbl,p);
    push(inp,p);
    
    return p;
  }

  function input(args, related) {
    var p, lbl, inp, ch, opt, flg, val, txt;

    p = node("p");
    p.className = "inline field";
    lbl = node("label");
    flg=false;
    
    if(args.type==="select" || args.suggest) {
      flg=true;
      inp = node("select");
      inp.value = args.value.toString()||"";
      inp.className = "ui dropdown ";
      if(Array.isArray(args.suggest)) {
        for(var ch of args.suggest) {
          opt = option(ch);
          push(opt,inp);
        }
      }
      if(related) {
        lst = related[args.suggest.related];
        if(Array.isArray(lst)) {
          val = args.suggest.value;
          txt = args.suggest.text;
          for(var ch of lst) {
            opt = option({text:ch[txt],value:ch[val]});
            push(opt,inp);
          }
        }
      }
    }
    if(flg===false && args.type==="area") {
      flg=true;
      inp = node("textarea");
      inp.innerText = args.value.toString()||"";
    }
    if(flg===false) {
      inp = node("input");
      inp.value = args.value.toString()||"";
      inp.type = (args.type||"text");
    }
    
    lbl.className = "data";
    lbl.innerHTML = args.prompt||"";
    inp.name = args.name||"";
    inp.className = inp.className + "value "+ (args.className||"");
    inp.required = (args.required||false);
    inp.readOnly = (args.readOnly||false);
    if(args.pattern) {inp.pattern = args.pattern;}
    if(args.max) {inp.max = args.max;}
    if(args.min) {inp.min = args.min;}
    if(args.maxlength) {inp.maxlength = args.maxlength;}
    if(args.size) {inp.size = args.size;}
    if(args.step) {inp.step = args.step;}
    if(args.cols) {inp.cols = args.cols;}
    if(args.rows) {inp.rows = args.rows;}
    push(lbl,p);
    push(inp,p);
    
    return p;
  }
  
  function data(args) {
    var p, s1, s2;

    p = node("p");
    p.className = args.className||"";
    s1 = node('span');
    s1.className = "prompt ui label";
    s1.innerHTML = args.text||"";;
    s2 = node("span");
    s2.className = "value";
    s2.innerHTML = args.value||"";
    push(s1,p);
    push(s2,p);

    return p;
  }

  function data_row(args) {
    var tr, th, td;

    tr = node("tr");
    tr.className = args.className||"";
    th = node("td");
    th.innerHTML = "<strong>" + args.text + "</strong>"||"";
    td = node("td");
    td.className = "value";
    td.innerHTML = args.value||"";
    push(th,tr);
    push(td,tr);

    return tr;
  }
  
  function anchor(args) {
    var a;

    a = node("a");
    a.rel = args.rel||"link";
    a.href = args.href||"#";
    a.className = args.className||"link";
    a.title = args.text||"link";
    if(args.type) {
      a.type = args.type;
    }
    push(text(args.text||"link"), a);

    return a;
  }
  
  function image(args) {
    var img;

    img = node("img")
    img.src = args.href||"";
    img.className = args.rel||"";
    img.title = args.title||"";

    return img;
  }
  
  function link(args) {
    var lnk;  

    lnk = node("link");
    lnk.rel = args.rel||"";
    lnk.href = args.href||"";
    lnk.title = args.title||"";
    lnk.className = args.className||"";

    return lnk;
  }
  
  // *************************
  // low-level helpers for DOM
  // *************************
  
  // pushes elements into the DOM
  // takes list of elements as args
  function push() {
    var source, target, args;
    
    args = arguments;
    if(args.length>=2) {
      for(i=0,x=args.length;i<x;i++) {
        source=args[i];
        target=args[i+1];
        if(target) {
          target.appendChild(source);
        }
      }
    }
  }

  function cls(className, elm) {
    var rtn;
    
    if(elm) {
      rtn = elm.getElementsByClassName(className);
    }
    else {
      rtn = document.getElementsByClassName(className);
    }
  }
  
  // returns a collection of nodes by tag name
  function tags(tag, elm) {
    var rtn;
    
    if(elm) {
      rtn = elm.getElementsByTagName(tag);
    }
    else {
      rtn = document.getElementsByTagName(tag);
    }
    return rtn;
  }

  // returns a single node by id
  function find(id) {
    return document.getElementById(id);
  }

  // creates a text node
  function text(txt) {
    return document.createTextNode(txt);
  }

  // creates a document node
  function node(type) {
    return document.createElement(type);
  }

  // removes child nodes
  function clear(elm) {
    while (elm.firstChild) {
      elm.removeChild(elm.firstChild);
    }
  }

  // publish functions
  that = {};
  that.push = push;
  that.tags = tags;
  that.find = find;
  that.text = text;
  that.node = node;
  that.clear = clear;
  that.link = link;
  that.image = image;
  that.anchor = anchor;
  that.data = data;    
  that.data_row = data_row;
  that.input = input;
  that.para = para;
  that.option = option;
    
  return that;
}

