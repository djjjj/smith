/**
 * Created by djj on 18-2-7.
 */

// class define
var ATTR_SELECTED = 'selected';
var ATTR_HOLDING = 'holding';

var FILTER_ATTRIBUTES = [TOKEN_ID, ATTR_HOLDING, ATTR_SELECTED, 'target', 'alt'];

// html element
var info_box = new InfoBox();
var mark_box = new MarkBox();
var iframe = new Iframe(info_box, mark_box);

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
    var active_e = $('.tab-content').find('.active')[0];
    var input = $(active_e).find('input')[0];
    var type = active_e.id;
    var formData = new FormData();
    if (type === 'file')
        formData.append("data", $(input).files[0]);
    else if (type === 'url')
        formData.append("data", $(input).val());
    formData.append("type", type);
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
        success: function(responseStr) {
            var box = $('#showBox').text('');
            $(iframe.elem).appendTo(box);
            iframe.show(responseStr.data);
        },
        complete: function () {
            $("#go").removeAttr("disabled");
            $("#loading").hide();
        }
    });
});

$('#submit').on('click', function() {
    var result = mark_box.get_markers();

    var formData = new FormData();
    formData.append("data", iframe.html);
    formData.append("target", JSON.stringify(result));
    $.ajax({
        url : parse_api,
        type : 'POST',
        data : formData,
        // 告诉jQuery不要去处理发送的数据
        processData : false,
        // 告诉jQuery不要去设置Content-Type请求头
        contentType : false,
        beforeSend: function(){
            $("#submit").attr({ disabled: "disabled" });
        },
        success: function(responseStr) {
            $('#output').text(JSON.stringify(responseStr.data, null, 4));
        },
        complete: function () {
            $("#submit").removeAttr("disabled");
        }
    });

});
