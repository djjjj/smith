// vim: set et sw=2 ts=2 sts=2 ff=unix fenc=utf8:
// Author: Binux<i@binux.me>
//         http://binux.me
// Created on 2014-07-10 18:47:00

// class define
var CLASS_SELECTED = 'selected';
var CLASS_HOLDING = 'holding';

// var define
var TOKEN_ID = 'tokenid';
var MARKER = [];
var MARKER_ITEM = {
};

var iframe_css = '\
['+CLASS_HOLDING+']:hover {background: #00FFFF !important;}\
img['+TOKEN_ID+']:hover, img.'+CLASS_SELECTED+'['+TOKEN_ID+'] {\
  border: 5px solid #00FFFF !important;\
  box-sizing: border-box;\
}\
.field-menu {\
  border: 1px solid black;\
  position: fixed;\
  list-style-type: none;\
  padding: 0;\
  background-color: #f0f0f0;\
  z-index: 99999;\
}\
\
.field-menu li {\
  border: 0;\
  margin: 0;\
  padding: 3px 10px;\
  cursor: pointer;\
}\
.field-menu li:hover {\
  background-color: lightgray;\
}';
var content_menu = '\
<ul id=field-menu>\
  <hr />\
  <li class=add-item data-type=TEXT>new TEXT</li>\
  <li class=add-item data-type=URL>new URL</li>\
  <li class=add-item data-type=NUMBER>new NUM</li>\
  <li class=add-item data-type=DATETIME>new DATETIME</li>\
  <li class=add-item data-type=IMAGE>new IMAGE</li>\
</ul>\
';

var schema = {
  'name': {
    type: 'TEXT',
    is_list: false
  },
  'image': {
    type: 'IMAGE',
    is_list: false
  },
  'rank': {
    type: 'TEXT',
    is_list: false
  },
  'description': {
    type: 'TEXT',
    is_list: false
  },
  'stars': {
    type: 'TEXT',
    is_list: true
  }
};
var schema_order = ['name', 'image', 'rank', 'description', 'stars'];
function load_schema() {
  if (localStorage.getItem('schema')) {
    schema = JSON.parse(localStorage.getItem('schema'));
    schema_order = JSON.parse(localStorage.getItem('schema_order'));
  }
}
load_schema();
function save_schema() {
  while (schema_order.length > 10) {
    schema[schema_order.pop()] = undefined;
  }
  localStorage.setItem('schema', JSON.stringify(schema));
  localStorage.setItem('schema_order', JSON.stringify(schema_order));
}

function Iframe(index) {
  this.index = index;
  this.elem = $('<iframe sandbox="allow-same-origin allow-scripts"'
           +' data-index="'+index
           +'" style="display: none;"></iframe>').get(0);
  this.mark = {};
  this.data = {};
  this.uniq_id = 0;
  this.bind();
}
function InfoBox() {
  var _this = this;
  this.elem = $('#infoBox').get(0);
  this.show = function(e) {
    var target = e.target;
    var attributes = {
      'href': target.href || '',
      'class': target.getAttribute('class') || '',
      'id': target.id || '',
      'text': target.innerText || '',
      'label': '<'+target.tagName.toLowerCase()+'>'
    };
    for (var k in attributes) {
        var tr = $('<tr></tr>');
        $('<th></th>').text(k).appendTo(tr);
        $('<td></td>').text(attributes[k]).appendTo(tr);
        tr.prependTo(_this.elem);
    }

    $(_this.elem).show();
  };
  this.clear = function() {
    $(_this.elem).empty();
  }
}
var info_box = new InfoBox();

Iframe.prototype.show = function() {
  if (!this.loaded) {
    this.load_page();
  } else {
    this.update_content_menu();
  }
  $('.tabbody iframe').hide();
  $(this.elem).show();
};
Iframe.prototype.load_page = function() {
  var _this = this;
  var f = document.getElementById("file4").files[0];
  var reader =new FileReader();
  reader.readAsText(f);
  reader.onload=function(e){
    _this.write(this.result);
  };
  _this.loaded = true;
};
Iframe.prototype.hide = function() {
  $(this.elem).hide();
};
Iframe.prototype.get_doc = function() {
  return this.elem.contentWindow.document;
};
Iframe.prototype.write = function(content) {
  var doc = this.get_doc();
  var dom = (new DOMParser()).parseFromString(content, "text/html");
  Array.prototype.forEach.call(dom.querySelectorAll('script'), function(script) {
    script.setAttribute('type', 'text/plain');
  });
  doc.open();
  doc.write(dom.documentElement.innerHTML);
  doc.close();
};
Iframe.prototype.bind = function() {
  var _this = this;
  this.elem.addEventListener('load', function() {
    // resize
    _this.elem.style.height = _this.get_doc().body.scrollHeight+'px';
    // prevent click
    _this.get_doc().addEventListener('click', function(ev) {
      ev.stopImmediatePropagation();
      ev.stopPropagation();
      ev.preventDefault();
    });
    // inject css
    var css = _this.get_doc().createElement('style');
    css.innerHTML = iframe_css;
    _this.get_doc().head.appendChild(css);
    // update_content_menu
    _this.update_content_menu();

    _this.bind_selector();
  });
};
Iframe.prototype.clear_token = function(start, end) {
  var tokens = this.tokens;
  if (end < 0) end = tokens.length + end;
  for (var i=start; i<=end; i++) {
    if (!tokens[i]) continue;
    if (this.tokens_marked[i].length > 0) continue;
    tokens[i].removeAttribute(CLASS_SELECTED);
  }
};
Iframe.prototype.mark_token = function(start, end) {
  if (start > end) {
    var _tmp = end;
    end = start;
    start = _tmp;
  }
  var tokens = this.tokens;
  if (end < 0) end = tokens.length + end;
  for (var i=start; i<=end; i++) {
    if (!tokens[i]) continue;
    tokens[i].setAttribute(CLASS_SELECTED, 'true');
  }
  this.clear_token(0, start-1);
  this.clear_token(end+1, -1);
};
Iframe.prototype.stop_mark = function() {
  if (this.content_menu) {
    $(this.content_menu).hide();
  }
  this.clear_token(0, -1);
};
Iframe.prototype.bind_selector = function() {
  var doc = this.get_doc();
  var $doc = $(doc);
  var _this = this;

  // cache tokens
  var tokens = this.tokens = [];
  var tokens_marked = this.tokens_marked = [];
  $doc.find('['+TOKEN_ID+']').each(function(i, e) {
    var tokenid = parseInt(e.getAttribute(TOKEN_ID));
    tokens[tokenid] = e;
    tokens_marked[tokenid] = [];
  });

  // mousedown
  var wait_for_token = false;
  var token_start = null;
  var current_end = null;

  doc.addEventListener('mousedown', function(ev) {
    _this.mouse_x = ev.clientX || ev.pageX;
    _this.mouse_y = ev.clientY || ev.pageY;
    if (!ev.target.hasAttribute(TOKEN_ID)) {
      _this.stop_mark();
      wait_for_token = true;
    }
    ev.stopImmediatePropagation();
    ev.stopPropagation();
    ev.preventDefault();
    if (ev.target.classList.contains(CLASS_SELECTED)) {

    }
    var cur = parseInt(ev.target.getAttribute(TOKEN_ID));
    _this.stop_mark();
    _this.mark_token(cur, cur);
    token_start = cur;
    current_end = cur;
  });
  doc.addEventListener('mouseup', function(ev) {
    wait_for_token = false;
    if (!token_start) return;
    ev.stopImmediatePropagation();
    ev.stopPropagation();
    ev.preventDefault();
    var cur = current_end;
    _this.mark_token(token_start, cur);
    if (token_start > cur) {
      var _tmp = token_start;
      token_start = cur;
      cur = _tmp;
    }
    _this.onmark(token_start, cur);
    token_start = null;
    current_end = null;
  });
  doc.addEventListener('mouseover', function(ev) {
    if (!ev.target.hasAttribute(TOKEN_ID)) return ;
    ev.stopImmediatePropagation();
    ev.stopPropagation();
    ev.preventDefault();
    info_box.show(ev);
    ev.target.setAttribute(CLASS_HOLDING, 'true')
  });
  doc.addEventListener('mouseout', function(ev) {
    if (!ev.target.hasAttribute(TOKEN_ID)) return ;
    info_box.clear();
    ev.target.removeAttribute(CLASS_HOLDING)
  });

};
Iframe.prototype.update_content_menu = function() {
  var $doc = $(this.get_doc());
  var _this = this;
  if (this.content_menu) {
    $(this.content_menu).remove();
    this.content_menu = null;
  }
  var cm = this.content_menu = $(content_menu);
  var r_schema_order = [].concat(schema_order);
  r_schema_order.reverse();
  $.each(r_schema_order, function(i, k) {
    $('<li class=item></li>').text(k).prependTo(cm);
  });
  cm.on('mousedown', function(ev) {
    ev.stopImmediatePropagation();
    ev.stopPropagation();
    ev.preventDefault();
  });
  cm.find('li.item').on('click', function(ev) {
    var name = $(this).text();
    if (schema[name] === undefined) return;
    _this.add_mark(name, schema[name].type, schema[name].is_list);
  });
  cm.find('li.add-item').on('click', function(ev) {
    var name = window.prompt('属性名');
    if (!name) return;
    var is_list = window.confirm('这是一个多值属性');

    schema[name] = {
      type: $(this).data('type'),
      is_list: is_list
    };
    if (schema_order.indexOf(name) === -1)
      schema_order.unshift(name);
    save_schema();

    var offset = $(_this.content_menu).offset();
    _this.update_content_menu();
    $(_this.content_menu).offset(offset).show();
    _this.add_mark(name, schema[name].type, schema[name].is_list);
  });
  $doc.find('body').append(cm);
};

Iframe.prototype.onmark = function(start, end) {
  if (!this.content_menu) {
    this.update_content_menu();
  }
  this.cur_start = start;
  this.cur_end = end;
  console.log(this.content_menu)
  $(this.content_menu).show();
  console.log(this.mouse_x, this.mouse_y)
};
Iframe.prototype.add_mark = function(name, type, is_list) {
  var start = this.cur_start;
  var end = this.cur_end;
  var _this = this;

  _this.mark[name] = {
    type: type,
    is_list: is_list,
    pos:[{start: start, end: end}]
  };

  var uniq_id = _this.uniq_id++;
  if (!is_list) {
    $.each(_this.mark[name].pos, function(_, e) {
      for (var i=e.start; i<=e.end; i++) {
        var t = _this.tokens_marked[i];
        t.splice(t.indexOf(e.id), 1);
      }
    });
  }
  for (var i=start; i<=end; i++) {
    _this.tokens_marked[i].push(uniq_id);
  }
};

$('#go').on('click', function() {
  $('.tabhead, .tabbody, #output').html('');
  // iframe
  var iframe = new Iframe(0);
  iframe.url = '';
  $(iframe.elem).appendTo($('.tabbody')).get(0);
  iframe.show();
});
