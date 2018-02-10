/**
 * Created by djj on 18-2-7.
 */

function MarkItem(ele, token_id, index) {
    var _item = this;
    _item.ele = ele;
    _item.index = index;

    function PropertySelector() {
        var selector = $('<select></select>').attr('class', 'htmlProperty').append(
            $('<option value="text">text</option>')
        );
        var attributes = _item.ele.attributes;
        for (var i = 0; i < attributes.length; i++) {
            var property_name = attributes[i].name;
            if (-1 === $.inArray(property_name, FILTER_ATTRIBUTES))
                selector.append($(
                    '<option></option>'
                ).attr('value', property_name).text(property_name));
        }
        return selector
    };
    function GroupSelector() {
        var selector = $('<select class="selectpicker form-control" data-live-search="true" name="<span style="font-family:Arial, Helvetica, sans-serif;">addid</span><span style="font-family:Arial, Helvetica, sans-serif;">" id="addid"></span>  </select>').append(
            $('<option value="text">all</option>')
        );
//        for (var i = 0; i < attributes.length; i++) {
//            var property_name = attributes[i].name;
//            if (-1 === $.inArray(property_name, FILTER_ATTRIBUTES))
//                selector.append($(
//                    '<option></option>'
//                ).attr('value', property_name).text(property_name));
//        }
        return selector
    };
    function DeleteItem() {
        var _btn = this;
        var btn = $('<input type="button" value="delete"/>').attr('class', 'delete-btn');
        btn.bind('click', function () {
            _item.ele.removeAttribute(ATTR_SELECTED);
            _item.ele.removeAttribute(ATTR_HOLDING)
            mark_box.remove(_item.index)
        });
        return btn
    }

    var tr = $('<tr></tr>').attr({'index': index, 'class': 'mark-item'});
    $('<td></td>').attr('class', 'token-text').text(token_id).appendTo(tr);
    $('<td></td>').append(
        $('<input type="text"/>').attr('class', 'fieldName')
    ).appendTo(tr);
    $('<td></td>').append(new PropertySelector()).appendTo(tr);
    $('<td></td>').append(new GroupSelector()).appendTo(tr);
    $('<td></td>').append(new DeleteItem()).appendTo(tr);
    tr.bind('mouseover', function() {
        _item.ele.setAttribute(ATTR_HOLDING, 'true')
    });
    tr.bind('mouseleave', function() {
        _item.ele.removeAttribute(ATTR_HOLDING)
    });
    return tr;
}

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
}

MarkBox.prototype.add = function(ele) {
    var index = this.index;
    var token_id = ele.getAttribute(TOKEN_ID);
    var tr = new MarkItem(ele, token_id, index);
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
