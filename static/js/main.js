/**
 * Created by djj on 18-2-7.
 */

var height = document.documentElement.clientHeight || document.body.clientHeight;

// class define
var ATTR_SELECTED = 'selected';
var ATTR_HOLDING = 'holding';

var FILTER_ATTRIBUTES = [TOKEN_ID, ATTR_HOLDING, ATTR_SELECTED, 'target', 'alt'];

// html element
var info_box = new InfoBox();
var mark_box = new MarkBox();
var iframe = new Iframe(height);

// css
var iframe_css =
    '['+ATTR_HOLDING+']{' +
        'border:2px solid #011935!important;box-sizing:border-box;}' +
    '['+ATTR_SELECTED+']{' +
        'background: #37C6C0 !important;}' +
    'img['+ATTR_SELECTED+']{' +
        'border:2px solid #37C6C0;box-sizing:border-box;}' +
    'html {' +
        '-ms-overflow-style:none;' +
        'overflow:-moz-scrollbars-none;}' +
    'html::-webkit-scrollbar{width:0px}';

$('#go').on('click', function() {
    var active_e = $('.tab-content').find('.active')[0];
    var input = $(active_e).find('input')[0];
    var type = active_e.id;
    var formData = new FormData();
    if (type === 'file')
        formData.append("data", $(input)[0].files[0]);
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
    if (result.length > 0) {
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
    }
});
$('#select-toggle').on('click', function() {
    iframe.select_toggle();
});
