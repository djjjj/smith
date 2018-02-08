/**
 * Created by djj on 18-2-7.
 */

// class define
var CLASS_SELECTED = 'selected';
var CLASS_HOLDING = 'holding';

// var define
var TOKEN_ID = 'tokenid';

var css = '\
['+CLASS_HOLDING+']:hover {\
    background: #BBFFFF !important;\
}\
['+CLASS_SELECTED+'] {\
    background: #FFFF37 !important;\
}\
img['+TOKEN_ID+']:hover, img.'+CLASS_SELECTED+'['+TOKEN_ID+'] {\
    border: 5px solid #00FFFF !important;\
    box-sizing: border-box;\
}';

function Iframe(info_box, mark_box) {
  this.info_box = info_box;
  this.mark_box = mark_box
  this.elem = $('<iframe sandbox="allow-same-origin allow-scripts"'
           +'" style="display: none;"></iframe>').get(0);
  this.data = {};
  this.bind();
}
Iframe.prototype.show = function() {
  if (!this.loaded) {
    this.load_page();
  } else {
  }
  $('.tabbody iframe').hide();
  $(this.elem).show();
};
Iframe.prototype.load_page = function() {
  var _this = this;
  var f = document.getElementById("file4").files[0];
  var reader =new FileReader();
  reader.readAsText(f);
  reader.onload=function(){
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
    var style = _this.get_doc().createElement('style');
    style.innerHTML = css;
    _this.get_doc().head.appendChild(style);
    _this.bind_selector();
  });
};
Iframe.prototype.bind_selector = function() {
  var doc = this.get_doc();
  var _this = this;
  doc.addEventListener('mousedown', function(ev) {
    _this.mouse_x = ev.clientX || ev.pageX;
    _this.mouse_y = ev.clientY || ev.pageY;
    var element = ev.target;
    if (!element.hasAttribute(TOKEN_ID)){
      return;
    }
    ev.stopImmediatePropagation();
    ev.stopPropagation();
    ev.preventDefault();
    if (!element.hasAttribute(CLASS_SELECTED))
      _this.mark(element)
  });

  doc.addEventListener('mouseover', function(ev) {
    if (!ev.target.hasAttribute(TOKEN_ID)) return ;
    ev.stopImmediatePropagation();
    ev.stopPropagation();
    ev.preventDefault();
    _this.info_box.show(ev);
    ev.target.setAttribute(CLASS_HOLDING, 'true')
  });
  doc.addEventListener('mouseout', function(ev) {
    if (!ev.target.hasAttribute(TOKEN_ID)) return ;
    _this.info_box.clear();
    ev.target.removeAttribute(CLASS_HOLDING)
  });

};
Iframe.prototype.mark = function(element) {
    element.setAttribute(CLASS_SELECTED, true);
    this.mark_box.add(element)
};
