#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
    hack by djj -_,- | good luck!
"""
from copy import copy
from functools import reduce
from lxml import html

from .target_node import TargetNode
from .html_marker import TOKEN_ID


class TargetTree(object):

    def __init__(self, marked_doc, target_list):
        # init
        self._target_nodes = {
            _['token_id']: TargetNode(
                html_element_attribute=_['html_element_attribute'],
                token_id=_['token_id'],
                field_name=_['field_name']
            )
            for _ in target_list
        }
        self._target_pth = []
        self._target_tree = []
        self._create_pth_list(marked_doc, [])
        self._create_target_tree()

    @property
    def target_tree(self):
        return self._target_tree

    def _create_target_tree(self):
        def compare(l1, l2):
            result = []
            for i, item in enumerate(l1):
                if isinstance(item, list):
                    new_item = []
                    flag = False
                    for child in item:
                        if child[0] == l2[i]:
                            tmp = compare(child, l2[i:])
                            new_item.append(tmp)
                            result.append(new_item)
                            flag = True
                            break
                        new_item.append(child)
                    if flag:
                        break
                    item.append(l2[i:])
                    result.append(item)
                    break
                elif l1[i] != l2[i]:
                    result.append([l1[i:], l2[i:]])
                    break
                else:
                    result.append(item)
            return result

        self._target_tree = reduce(compare, self._target_pth)

    def _create_pth_list(self, doc, pth):
        for child in doc.iterchildren():
            new_path = copy(pth)
            identity = self._get_html_identify(child)
            node = TargetNode(identity=identity)
            new_path.append(node)
            _id = child.get(TOKEN_ID)
            if _id and _id in self._target_nodes:
                target = self._target_nodes[_id]
                target.identity = identity
                new_path[-1] = target
                self._target_pth.append(new_path)
            self._create_pth_list(child, new_path)

    @staticmethod
    def _get_html_identify(element):
        tag = element.tag
        _id = element.get('id')
        _class = element.get('class')
        if _id:
            return '%s[id="%s"]' % (tag, _id)
        elif _class:
            return '%s[class="%s"]' % (tag, _class)
        else:
            return tag
