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

    _box.MarkItem = function(property_selector, close_btn, token_id, index) {
        var tr = $('<tr></tr>').attr({'index': index, 'class': 'mark-item'});
        $('<td></td>').attr('class', 'token-text').text(token_id).appendTo(tr);
        $('<td></td>').append(
            $('<input type="text"/>').attr('class', 'fieldName')
        ).appendTo(tr);
        $('<td></td>').append(property_selector).appendTo(tr);
        $('<td></td>').append(close_btn).appendTo(tr);
        return tr;
    };
    _box.propertySelector = function(ele) {
        var selector = $('<select></select>').attr('class', 'htmlProperty').append(
            $('<option value="text">text</option>')
        );
        var attributes = ele.attributes;
        for (var i = 0; i < attributes.length; i++) {
            var property_name = attributes[i].name;
            if (-1 === $.inArray(property_name, FILTER_ATTRIBUTES))
                selector.append($(
                    '<option></option>'
                ).attr('value', property_name).text(property_name));
        }
        return selector

    };
    _box.CloseItem = function(ele, index) {
        var _btn = this;
        _btn.index = index;
        _btn.ele = ele;
        var btn = $('<input type="button" value="delete"/>').attr('class', 'delete-btn');
        btn.bind('click', function () {
            _btn.ele.removeAttribute(ATTR_SELECTED);
            _box.remove(_btn.index)
        });
        return btn
    }
}
MarkBox.prototype.add = function(ele) {
    var index = this.index;
    var token_id = ele.getAttribute(TOKEN_ID);
    var selector = new this.propertySelector(ele);
    var close_btn = new this.CloseItem(ele, index);
    var tr = new this.MarkItem(selector, close_btn, token_id, index);
    tr.appendTo(this.elem);
    this.index += 1
};
MarkBox.prototype.remove = function(index) {
    $(this.elem).find('tr[index='+index+']').remove();
};
MarkBox.prototype.get_markers = function() {
    var result = [];
    var children = $(this.elem).find('.mark-item');
    var flag = true;
    for (var i = 0; i < children.length; i++){
        var token_id = $(children[i]).find('.token-text')[0].innerText;
        var input = $(children[i]).find('.fieldName');
        var field_name = input.val();
        var attr = $(children[i]).find('.htmlProperty').val();
        if (!field_name) {
            input.addClass('warn');
            flag = false;
        }
        else
            input.removeClass('warn');
        result.push({
            'token_id': token_id,
            'field_name': field_name,
            'html_element_attribute': attr
        })
    }
    if (flag === false)
        return [];
    else
        return result;
};
