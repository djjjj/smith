/**
 * Created by djj on 18-2-7.
 */


function InfoBox() {
    this.elem = $('#infoBox').get(0);
}
InfoBox.prototype.show = function(e) {
    var target = e.target;
    var attributes = {
      'text': target.innerText || '',
      'label': '<'+target.tagName.toLowerCase()+'>'
    };
    for (var i = 0; i < target.attributes.length; i++){
        var property_name = target.attributes[i].name;
        if (-1 === $.inArray(property_name, FILTER_ATTRIBUTES))
            attributes[property_name] = target.attributes[i].value;
    }

    for (var k in attributes) {
        var tr = $('<tr></tr>');
        $('<th></th>').text(k).appendTo(tr);
        $('<td></td>').text(attributes[k]).appendTo(tr);
        tr.prependTo(this.elem);
    }
    $(this.elem).show();
    return attributes
};
InfoBox.prototype.clear = function() {
    $(this.elem).empty();
};