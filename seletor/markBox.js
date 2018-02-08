/**
 * Created by djj on 18-2-7.
 */

function MarkBox() {
    var _box = this;
    _box.elem = $('#MarkBox').get(0);
    _box.index = 0;

    $('<tr>' +
        '<th>id</th>' +
        '<th>field name</th>' +
        '<th>element property</th>' +
        '<th></th>' +
      '</tr>').appendTo(this.elem);

    _box.MarkItem = function(close_btn, token_id, index) {
        var tr = $('<tr></tr>').attr('index', index);
        $('<td></td>').attr('class', 'token-text').text(token_id).appendTo(tr);
        $('<td></td>').append(
            $('<input type="text"/>').attr('class', 'fieldName')
        ).appendTo(tr);
        $('<td></td>').append(
            $('<select>'+
                '<option value="text">text</option>'+
                '<option value="href">href</option>'+
              '</select>').attr('class', 'htmlProperty')
        ).appendTo(tr);
        $('<td></td>').append(close_btn).appendTo(tr);
        return tr;
    };
    _box.CloseItem = function(ele, index) {
        var _btn = this;
        _btn.index = index;
        _btn.ele = ele;
        var btn = $('<input type="button" value="delete"/>').attr('class', 'delete-btn');
        btn.bind('click', function () {
            _btn.ele.removeAttribute(CLASS_SELECTED);
            _box.remove(_btn.index)
        });
        return btn
    }
}
MarkBox.prototype.add = function(ele) {
    var index = this.index;
    var token_id = ele.getAttribute(TOKEN_ID);
    var close_btn = new this.CloseItem(ele, index);
    var tr = new this.MarkItem(close_btn, token_id, index);
    tr.appendTo(this.elem);
    this.index += 1
};
MarkBox.prototype.remove = function(index) {
    $(this.elem).find('tr[index='+index+']').remove();
};
