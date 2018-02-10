var content_menu = '\
<ul id=field-menu>\
  <hr />\
  <li class=add-item data-type=TEXT>new TEXT</li>\
  <li class=add-item data-type=URL>new URL</li>\
  <li class=add-item data-type=NUMBER>new NUM</li>\
  <li class=add-item data-type=DATETIME>new DATETIME</li>\
  <li class=add-item data-type=IMAGE>new IMAGE</li>\
</ul>\
';

var schema = {
  'name': {
    type: 'TEXT',
    is_list: false
  },
  'image': {
    type: 'IMAGE',
    is_list: false
  },
  'rank': {
    type: 'TEXT',
    is_list: false
  },
  'description': {
    type: 'TEXT',
    is_list: false
  },
  'stars': {
    type: 'TEXT',
    is_list: true
  }
};
var schema_order = ['name', 'image', 'rank', 'description', 'stars'];
function load_schema() {
  if (localStorage.getItem('schema')) {
    schema = JSON.parse(localStorage.getItem('schema'));
    schema_order = JSON.parse(localStorage.getItem('schema_order'));
  }
}
load_schema();
function save_schema() {
  while (schema_order.length > 10) {
    schema[schema_order.pop()] = undefined;
  }
  localStorage.setItem('schema', JSON.stringify(schema));
  localStorage.setItem('schema_order', JSON.stringify(schema_order));
}