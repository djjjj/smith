/**
 * Created by djj on 18-2-7.
 */

function Iframe(height) {
  this.height = height;
  this.can_select = false;
  this.marked = false;
  this.loaded = false;
  this.elem = $('<iframe sandbox="allow-same-origin allow-forms allow-scripts"></iframe>').get(0);
  this.bind();
}
Iframe.prototype.show = function(html) {
    this.html = html;
    this.loaded = false;
    $(iframe.elem).appendTo($('#showBox').text(''));
    this.loaded = true;
    var doc = this.get_doc();
    var dom = (new DOMParser()).parseFromString(html, "text/html");
    Array.prototype.forEach.call(dom.querySelectorAll('script'), function(script) {
        script.setAttribute('type', 'text/plain');
    });
    doc.open();
    doc.write(dom.documentElement.innerHTML);
    doc.close();
};

Iframe.prototype.hide = function() {
  $(this.elem).hide();
};
Iframe.prototype.get_doc = function() {
    return this.elem.contentWindow.document;
};
Iframe.prototype.bind = function() {
    var _this = this;
    this.elem.addEventListener('load', function() {
        if (_this.loaded === false) return;
        if (_this.marked === true){
            // resize
            _this.elem.style.height = (_this.height-$('#select-toggle')[0].offsetHeight-20)+'px';
            // inject css
            var style = _this.get_doc().createElement('style');
            style.innerHTML = iframe_css;
            _this.get_doc().head.appendChild(style);
            _this.select_toggle();
            _this.marked = false;
        } else {
            _this.mark_html('text', $(_this.get_doc()).find('html')[0].outerHTML);
        }
    });
};
Iframe.prototype.bind_selector = function() {
  var doc = this.get_doc();
  doc.addEventListener('mousedown', this.mouse_down);
  doc.addEventListener('mouseover', this.mouse_over);
  doc.addEventListener('mouseout', this.mouse_out);
};
Iframe.prototype.unbind_selector = function() {
  var doc = this.get_doc();
  doc.removeEventListener('mousedown', this.mouse_down);
  doc.removeEventListener('mouseover', this.mouse_over);
  doc.removeEventListener('mouseout', this.mouse_out);

};
Iframe.prototype.select_toggle = function() {
    if (this.can_select){
        this.can_select = false;
        $('#select-toggle').removeClass('on');
        this.get_doc().removeEventListener('click', this.no_click);
        this.unbind_selector();
    }
    else{
        this.can_select = true;
        this.get_doc().addEventListener('click', this.no_click);
        $('#select-toggle').addClass('on');
        this.bind_selector();
    }
};
Iframe.prototype.no_click = function(ev) {
    ev.stopImmediatePropagation();
    ev.stopPropagation();
    ev.preventDefault();
};
Iframe.prototype.mouse_down = function(ev) {
    var element = ev.target;
    if (!element.hasAttribute(TOKEN_ID)){
      return;
    }
    ev.stopImmediatePropagation();
    ev.stopPropagation();
    ev.preventDefault();
    if (!element.hasAttribute(ATTR_SELECTED)){
        element.setAttribute(ATTR_SELECTED, 'selected');
        mark_box.add(element)
    }
};

Iframe.prototype.mouse_over = function(ev) {
    if (!ev.target.hasAttribute(TOKEN_ID)) return ;
    ev.stopImmediatePropagation();
    ev.stopPropagation();
    ev.preventDefault();
    info_box.show(ev);
    ev.target.setAttribute(ATTR_HOLDING, 'holding')
};
Iframe.prototype.mouse_out = function(ev) {
    if (!ev.target.hasAttribute(TOKEN_ID)) return ;
    info_box.clear();
    ev.target.removeAttribute(ATTR_HOLDING)
};
Iframe.prototype.mark_html = function(type, data) {
    var _this = this;
    var formData = new FormData();
    formData.append("type", type);
    formData.append("data", data);
    $.ajax({
        url : mark_api,
        type : 'POST',
        data : formData,
        // 告诉jQuery不要去处理发送的数据
        processData : false,
        // 告诉jQuery不要去设置Content-Type请求头
        contentType : false,
        beforeSend: function(){
            $("#go").attr({ disabled: "disabled" });
            $("#loading").show();
        },
        success: function(response_data) {
            _this.marked = true;
            _this.show(response_data.data);
        },
        complete: function () {
            $("#go").removeAttr("disabled");
            $("#loading").hide();
        }
    });
};
