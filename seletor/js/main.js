/**
 * Created by djj on 18-2-7.
 */

// class define
var ATTR_SELECTED = 'selected';
var ATTR_HOLDING = 'holding';

// var define
var TOKEN_ID = 'token_id';

var FILTER_ATTRIBUTES = [TOKEN_ID, ATTR_HOLDING, ATTR_SELECTED, 'target', 'alt'];

// html element
var info_box = new InfoBox();
var mark_box = new MarkBox();

// css
var iframe_css = '\
['+ATTR_HOLDING+']:hover {\
    background: #BBFFFF !important;\
}\
['+ATTR_SELECTED+'] {\
    background: #FFFF37 !important;\
}\
img['+TOKEN_ID+']:hover, img.'+ATTR_SELECTED+'['+TOKEN_ID+'] {\
    border: 5px solid #00FFFF !important;\
    box-sizing: border-box;\
}';

$('#go').on('click', function() {
    // iframe
    var iframe = new Iframe(info_box, mark_box);
    $(iframe.elem).appendTo($('#showBox'));
    iframe.show();
});

$('#submit').on('click', function() {
    var result = mark_box.get_markers();
    $('#output').text(JSON.stringify(result, null, 4));
});
