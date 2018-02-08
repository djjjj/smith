/**
 * Created by djj on 18-2-7.
 */

function InfoBox() {
    this.elem = $('#infoBox').get(0);
}
InfoBox.prototype.show = function(e) {
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
        tr.prependTo(this.elem);
    }
    $(this.elem).show();
};
InfoBox.prototype.clear = function() {
    $(this.elem).empty();
};