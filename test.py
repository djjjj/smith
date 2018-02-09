# coding: utf-8
import json
from lxml import html

from core.target_tree import TargetTree
from core.html_marker import html_mark
from core.coder import Coder

html_mark(in_f='/home/djj/htmls2/0.html', out_f='./seletor/sample.html')
doc = html.fromstring(open('./seletor/sample.html').read())

target_list = """[
    {
        "token_id": "337",
        "field_name": "title",
        "html_element_attribute": "text"
    },
    {
        "token_id": "340",
        "field_name": "text",
        "html_element_attribute": "text"
    },
    {
        "token_id": "341",
        "field_name": "link",
        "html_element_attribute": "text"
    },
    {
        "token_id": "16",
        "field_name": "keyword",
        "html_element_attribute": "value"
    }
]"""

target_list = json.loads(target_list)
tt = TargetTree(doc, target_list)
cc = Coder(tt._target_tree)
print '\n'.join(cc._codes)
