/**
 * Created by djj on 18-2-7.
 */


function InfoBox() {
    this.elem = $('#infoBox').get(0);
    this.x = null;
    this.y = null;
    this.attributes = null;
}
InfoBox.prototype.show = function(e) {
    this.attributes = {
      'text': e.target.innerText || '',
      'label': '<'+e.target.tagName.toLowerCase()+'>'
    };
    for (var i = 0; i < e.target.attributes.length; i++){
        var property_name = e.target.attributes[i].name;
        if (-1 === $.inArray(property_name, FILTER_ATTRIBUTES))
            this.attributes[property_name] = e.target.attributes[i].value;
    }
    for (var k in this.attributes) {
        var tr = $('<tr></tr>');
        $('<th></th>').text(k).appendTo(tr);
        $('<td></td>').text(this.attributes[k]).appendTo(tr);
        tr.prependTo(this.elem);
    }
    this.x = (e.clientX || e.pageX)+50;
    this.y = (e.clientY || e.pageY)+80;

    var overflow_y = this.y + this.elem.offsetHeight - height;
    var overflow_x = this.x + this.elem.offsetWidth - width;
    if (overflow_y >= 0)
        this.y -= (80+overflow_y);
    if (overflow_x >= 0)
        this.x -= (50+overflow_x);

    $(this.elem).css({
        'left': this.x,
        'top': this.y
    }).show();
};
InfoBox.prototype.clear = function() {
    $(this.elem).empty();
};