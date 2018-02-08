/**
 * Created by djj on 18-2-7.
 */

$('#go').on('click', function(e) {
    $('.tabhead, .tabbody, #output').html('');
    var info_box = new InfoBox();
    var mark_box = new MarkBox();
    // iframe
    var iframe = new Iframe(info_box, mark_box);
    iframe.url = '';
    $(iframe.elem).appendTo($('.tabbody')).get(0);
    iframe.show();
    e.target.setAttribute('disabled', true)
});

$('#submit').on('click', function() {

})
