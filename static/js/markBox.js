/**
 * Created by djj on 18-2-7.
 */

var general = 'general';
var groups = [];

function MarkItem(ele, token_id, index) {
    var _item = this;
    _item.ele = ele;
    _item.index = index;

    function PropertySelector() {
        var selector = $('<select></select>').append(
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
    }
    function GroupManager() {
        var _gm = this;
        groups.unshift(general);
        _gm.pre_value = groups[groups.length-1];
        var text_input = $('<input type="text"/>');
        text_input.val(this.pre_value);
        text_input.get(0).onchange = function(e) {
            var value = e.target.value;
            var i = groups.indexOf(_gm.pre_value);
            groups.splice(i, i+1);
            if (!value){
                value = general;
                _gm.text_input.val(value);
            }
            _gm.pre_value = value;
            groups.push(value);
        };
        _gm.text_input = text_input;
        return text_input
    }
    function DeleteItem() {
        var btn = $('<input type="button" value="delete"/>').attr('class', 'delete-btn');
        btn.bind('click', function () {
            _item.ele.removeAttribute(ATTR_SELECTED);
            _item.ele.removeAttribute(ATTR_HOLDING);
            mark_box.remove(_item.index)
        });
        return btn
    }

    var tr = $('<tr></tr>').attr({'index': index, 'class': 'mark-item'});
    $('<td></td>').append(
        $('<input type="text" disabled/>')
    ).text(token_id).appendTo(tr);
    $('<td></td>').append(
        $('<input type="text"/>')
    ).appendTo(tr);
    $('<td></td>').append(new PropertySelector()).appendTo(tr);
    $('<td></td>').append(new GroupManager()).appendTo(tr);
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
        var tds = children[i].childNodes;
        var token_id = tds[0].innerText;
        var field_input = $(tds[1].childNodes[0]);
        var field_name = field_input.val();
        var attr = tds[2].childNodes[0].value;
        var group = tds[3].innerText;
        if (!field_name) {
            field_input.addClass('warn');
            flag = false;
        }
        else
            field_input.removeClass('warn');
        result.push({
            'token_id': token_id,
            'field_name': field_name,
            'html_element_attribute': attr,
            'group_name': group
        })
    }
    if (flag === false)
        return [];
    else
        return result;
};
