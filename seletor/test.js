// vim: set et sw=2 ts=2 sts=2 ff=unix fenc=utf8:
// Author: Binux<i@binux.me>
//         http://binux.me
// Created on 2014-07-10 18:47:00

// load sample urls
$('#url-button').on('click', function() {
  alert('not support!');
  return;
});


var iframe_css = '\
textnode['+TOKENID_WORD+']:hover, .binux-selected['+TOKENID_WORD+'] {\
  background: orange !important;\
}\
img['+TOKENID_WORD+']:hover, img.binux-selected['+TOKENID_WORD+'] {\
  border: 3px solid orange !important;\
  box-sizing: border-box;\
}\
.binux-dropdown-menu {\
  border: 1px solid black;\
  position: fixed;\
  list-style-type: none;\
  padding: 0;\
  background-color: #f0f0f0;\
  z-index: 99999;\
}\
\
.binux-dropdown-menu li {\
  border: 0;\
  margin: 0;\
  padding: 3px 10px;\
  cursor: pointer;\
}\
.binux-dropdown-menu li:hover {\
  background-color: lightgray;\
}';
var content_menu = '\
<ul class=binux-dropdown-menu style="display:none;">\
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
};
Iframe.prototype.show = function(disable_output) {
  if (!disable_output)
    $('#output').text(JSON.stringify(this.mark_result(), null, '  '));
  if (!this.loaded) {
    this.load_page();
  } else {
    this.update_content_menu();
  }
  $('.tabbody iframe').hide();
  $(this.elem).show();
}
Iframe.prototype.load_page = function(url) {
  url = url || this.url;
  var _this = this;
  file = document.getElementById("file4").files[0];
  var reader =new FileReader();
  reader.readAsText(file);
  reader.onload=function(e){
  _this.write(this.result, url);
  }
  
  _this.loaded = true;
}
Iframe.prototype.mark_result = function() {
  var result = {};
  $.each(this.mark, function(k, v) {
    if (v.is_list) {
      result[k] = [];
      $.each(v.pos, function(i, _v) {
        var d = _v.data;
        if (_v.exclude) {
          d = '-'+d;
        }
        result[k].push(d);
      });
    } else {
      result[k] = v.pos[0] && v.pos[0].data;
      if (v.pos[0] && v.pos[0].exclude) {
        result[k] = '-'+result[k];
      }
    }
  });
  return result;
};
Iframe.prototype.hide = function() {
  $(this.elem).hide();
};
Iframe.prototype.get_doc = function() {
  return this.elem.contentWindow.document;
};
Iframe.prototype.write = function(content, base_url) {
  var doc = this.get_doc();

  var dom = (new DOMParser()).parseFromString(content, "text/html");
  if (base_url) {
    if (dom.querySelector('base')) {
      dom.querySelector('base').setAttribute('href', base_url);
    } else {
      let base = dom.createElement('base');
      base.setAttribute('href', base_url);
      dom.head.prepend(base);
    }
  }

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
    tokens[i].classList.remove('binux-selected');
  }
}
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
    tokens[i].classList.add('binux-selected');
  }
  this.clear_token(0, start-1);
  this.clear_token(end+1, -1);
}
Iframe.prototype.stop_mark = function() {
  if (this.content_menu) {
    $(this.content_menu).hide();
  }
  this.clear_token(0, -1);
}
Iframe.prototype.bind_selector = function() {
  var doc = this.get_doc();
  var $doc = $(doc);
  var _this = this;

  // cache tokens
  var tokens = this.tokens = [];
  var tokens_marked = this.tokens_marked = [];
  $doc.find('['+TOKENID_WORD+']').each(function(i, e) {
    var tokenid = parseInt(e.getAttribute(TOKENID_WORD));
    tokens[tokenid] = e;
    tokens_marked[tokenid] = [];
  });

  // mousedown
  var wait_for_token = false;
  var token_start = null;
  var current_end = null;

  doc.addEventListener('mousedown', function(ev) {
    if (!ev.target.hasAttribute(TOKENID_WORD)) {
      _this.stop_mark();
      wait_for_token = true;
    }
    ev.stopImmediatePropagation();
    ev.stopPropagation();
    ev.preventDefault();

    var cur = parseInt(ev.target.getAttribute(TOKENID_WORD));
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
    _this.mouse_x = ev.clientX || ev.pageX; 
    _this.mouse_y = ev.clientY || ev.pageY; 

    if (!ev.target.hasAttribute(TOKENID_WORD)) return ;
    var cur = parseInt(ev.target.getAttribute(TOKENID_WORD));

    if (wait_for_token && !token_start) {
      wait_for_token = false;
      token_start = cur;
    }
    // if (!token_start) return;
    console.log(cur);
    ev.stopImmediatePropagation();
    ev.stopPropagation();
    ev.preventDefault();

    current_end = cur;
    // _this.mark_token(token_start, cur);
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
      is_list: is_list,
    };
    if (schema_order.indexOf(name) == -1)
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
  var $doc = $(this.get_doc());
  if (!this.content_menu) {
    this.update_content_menu();
  };
  this.cur_start = start;
  this.cur_end = end;
  console.log(this.mouse_y, this.mouse_x);
  $(this.content_menu).css('top', this.mouse_y).css('left', this.mouse_x).show();
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
    console.log(_this.mark[name]);
    $.each(_this.mark[name].pos, function(_, e) {
      for (var i=e.start; i<=e.end; i++) {
        var t = _this.tokens_marked[i];
        t.splice(t.indexOf(e.id), 1);
      }
    });
    // _this.mark[name].pos = [];
  }
  //  _this.mark[name].pos.push(data[name].data[0]);
  $('#output').text(JSON.stringify(_this.mark_result(), null, '  '));
  for (var i=start; i<=end; i++) {
    _this.tokens_marked[i].push(uniq_id);
  }
};


$('#go').on('click', function() {
  $('.tabhead, .tabbody, #output').html('');
  var urls = $('#urls').val().split('\n');
  var iframes = [];

  // switcher
  $.each(urls, function(index, url) {
    if (url.length == 0) return;
    $('<button></button>').text(index).on('click', function() {
      // tab switch
      iframes[index].show();
      return false;
    }).appendTo($('.tabhead')).width('20px');
    $('<span> </span>').appendTo($('.tabhead'));

    // iframe
    var iframe = new Iframe(index);
    iframe.url = url;
    iframes.push(iframe);
    $(iframe.elem).appendTo($('.tabbody')).get(0);
    if (index == 0)
      iframe.show();
  });

  // next button
  $('<button>&gt;</button>').on('click', function() {
    var index = parseInt($('.tabbody iframe:visible').data('index')) + 1;
    if ($('.tabbody iframe[data-index='+index+']').length == 0) {
      index = 0;
    }
    iframes[index].show();
    return false;
  }).appendTo($('.tabhead'));

  // submit button
  $('<button>gen_tpl</button>').on('click', function() {
    var post_data = [];
    $('.tabbody iframe').each(function(index, _) {
      var iframe = iframes[index];
      post_data.push({
        url: iframe.url,
        mark: iframe.mark,
      });
    });
    console.log(post_data);

    $('#output').text('loading...');

    $.ajax({
      url: API_URL+'gen_tpl',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        mark_result: post_data,
      }),
    }).done(function(data) {
      $('#output').text(JSON.stringify(data, null, '  '));
      window.tpl = data['tpl'];
    }).fail(function(jqxhr) {
      try {
        var data = JSON.parse(jqxhr.responseText);
        $('#output').text('code: '+data['code']+'\nmessage: '+data['message']
                          +'\n'+data['traceback']);
      } catch(e) {
        $('#output').text(jqxhr.responseText);
      }
    });
    return false;
  }).appendTo($('.tabhead'));

  // test all
  function vin(v, list) {
    var ok = false;
    $.each(list, function(i, l) {
      if (v.exclude || l.exclude)
        return true;
      if (l.start == v.start && l.end == v.end) {
        ok = true;
        return false;
      }
    });
    return ok;
  }
  function formatv(v, cmp_v) {
    if (Array.isArray(v)) {
      var result = []
      $.each(v, function(i, v) {
        var fv = formatv(v);
        if (cmp_v !== undefined && !vin(v, cmp_v)) {
          fv = '<span class=error>+'+fv+'</span>';
        }
        result.push(fv);
      });
      if (cmp_v !== undefined) {
        $.each(cmp_v, function(i, cv) {
          if (cv.exclude)
            return;
          if (!vin(cv, v)) {
            var fv = formatv(cv);
            fv = '<span class=error>-'+fv+'</span>';
            result.push(fv);
          }
        });
      }
      return result.join(' / ');
    }

    var ret = '';
    if (v === null) {
      ret = '<span class=error>null</span>'
    }
    else if (v.data.name) {
      var a = $('<a class=remove-mark data-start='+v.start+' data-end='+v.end+'></a>')
                .attr('href', v.data.url).text(v.data.name);
      ret = $('<div></div>').append(a).html();
      if (cmp_v !== undefined && v.start != cmp_v.start && v.end != cmp_v.end) {
        ret = '<span class=error>'+ret+'</span>';
      }
    } else {
      var a = $('<span class=remove-mark data-start='+v.start+' data-end='+v.end+'></span>').text(v.data);
      ret = $('<div></div>').append(a).html();
    }

    return ret;
  }
  $(document).on('click', '.remove-mark', function(ev) {
    var $elem = $(ev.target);
    $elem.css('text-decoration', 'line-through');
    var index = $elem.parents('dl').data('index');
    var key = $elem.parents('dd').data('key');
    var start = $elem.data('start'), end = $elem.data('end');

    var v = iframes[index].mark[key];
    if (v === undefined) {
      iframes[index].mark[key] = {
        type: schema[key].type,
        is_list: schema[key].is_list,
        pos: [],
      }
      v = iframes[index].mark[key];
    }

    var found = false;
    $.each(v.pos, function(i, pos) {
      if (pos.start == start && pos.end == end) {
        pos.exclude = true;
        found = true;
      }
    });
    if (!found) {
      v.pos.push({
        'start': start,
        'end': end,
        'data': '-excluded-',
        'exclude': true,
      });
    }
  });

  // test all
  $('<button>test all</button>').on('click', function() {
    if (window.tpl === undefined) {
      alert('gen tpl first!')
      return;
    }
    $('#output').text('');

    $.each(urls, function(index, url) {
      var dl = $('<dl></dl>').data('index', index);
      $('<dt></dt>').text(url).on('click', function() {
        iframes[index].show(true);
      }).appendTo(dl);
      $('#output').append(dl);

      $.ajax({
        url: API_URL+'use_tpl',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          url: url,
          cache: true, 
          tpl: window.tpl,
          with_mark: true,
        }),
      }).done(function(data) {
        var mark = iframes[index].mark;
        $.each(data, function(k, v) {
          var cmp_v = mark[k] ? mark[k].pos : undefined;
          var dd = $('<dd></dd>').data('key', k)
            .append($('<span class=key></span>').text(k))
            .append($('<span>: </span>'))
            .append($('<span class=value></span>').html(formatv(v, cmp_v)))
            .appendTo(dl);
        });
      }).fail(function(jqxhr) {
        $('<dd>error</dd>').appendTo(dl);
      });
    });
  }).appendTo('.tabhead');

  $('<br />').appendTo('.tabhead');

  // test button
  $.each(urls, function(index, url) {
    $('<button></button>').text('test').on('click', function() {
      iframes[index].show();
      iframes[index].test_page();
    }).appendTo($('.tabhead')).width('20px');
    $('<span> </span>').appendTo($('.tabhead'));
  });
});
