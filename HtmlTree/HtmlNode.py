# -*- encoding: utf8 -*-
import re
from pyquery import PyQuery as pq


class HtmlNode:

    element_label_name = ''
    element_id = ''
    element_class = []
    element_attr = {}
    element_text = ''
    element_pre = 0
    element_index = 0
    element_child = []

    def __init__(self, raw_html, pre, index):
        self.element_pre = pre
        self.element_index = 0
        result = self._parse_raw_html(raw_html)

        self.element_label_name = result[0]
        self.element_id = result[1]
        self.element_class = result[2]
        self.element_attr = result[3]
        self.element_text = result[4]
        self.element_child = result[5]

    def _parse_raw_html(self, raw_html):
        match_label = re.search('<((?P<label>.+?) ?.*?)>([\s\S]*)</(?P=label)>', raw_html)
        if not match_label:
            return None
        label = match_label.group(1)
        node_content = match_label.group(3)
        _label_name, _id, _class, _attr = self._parse_element_attr(label)
        _text = self._parse_element_text(node_content) if node_content.strip() else None
        _children = self._parse_element_child(node_content)
        return _label_name, _id, _class, _attr, _text, _children

    @staticmethod
    def _parse_element_attr(self, raw_label_content):
        def findall_attr(label_str):
            attr = ''
            ret = []
            is_inner = False
            for c in label_str:
                if c in ' ' and not is_inner:
                    ret.append(attr)
                    attr = ''
                elif c == '"' and not is_inner:
                    is_inner = True
                elif c == '"' and is_inner:
                    is_inner = False
                elif c not in ('>', '/'):
                    attr += c
            if attr:
                ret.append(attr)
            return ret
        raw_str_list = findall_attr(raw_label_content)
        _label_name = ''
        _attr = {}
        for _ in raw_str_list:
            if '=' not in _:
                _label_name = _
            else:
                match = re.match('(.+)\=(.*)', _)
                key, val = match.groups()
                _attr[key] = val
        _id = _attr.get('id', None)
        _class = _attr.get('class', '')
        return _label_name, _id, _class, _attr

    @staticmethod
    def _parse_element_text(self, raw_content):
        """
        labels = []
        is_inner = False
        tmp1 = tmp2 = ret =''
        for c in raw_content:
            if c == '<':
                is_inner = True
            elif c == '>':
                if labels and tmp1 == '/%s' % labels[-1]:
                    ret += ' '
                    labels.pop()
                elif tmp1.endswith('/'):
                    pass
                else:
                    label, _, __, ___ = self._parse_element_attr(tmp1)
                    labels.append(label)
                tmp1 = ''
                is_inner = False
            elif is_inner:
                tmp1 += c
            elif not labels:
                ret += c
            tmp2 += c
        ret = re.sub('[\s]+', '', ret)
        return ret
        """
        return pq(raw_content).text()

    @staticmethod
    def _parse_element_child(self, raw_content):
        _node_child_list = re.findall('<(?P<label>.+?)>.+?</(?P=label)>', raw_content)
        return _node_child_list

    @property
    def identity(self):
        _identity = {}
        if self.element_id:
            _identity['identity_key'] = 'id'
            _identity['identity_val'] = self.element_id
        elif self.element_class:
            _identity['identity_key'] = 'class'
            _identity['identity_val'] = self.element_class
        else:
            _identity['identity_key'] = 'label'
            _identity['identity_val'] = self.element_label_name
        return _identity

if __name__ == '__main__':
    html = '<a id="aaa" class="aaa", href="aaaa.com">hahahah<span id="111">heh</span>adasdasdsa</a>'
    html_node = HtmlNode(html, 0, 0)
    print html_node.element_label_name
    print html_node.element_id
    print html_node.element_class
    print html_node.element_attr
    print html_node.element_text
