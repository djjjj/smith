#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
    hack by djj -_,- | good luck!
    date: 2018-02-10
"""
from pyquery import PyQuery


class Parser(object):

    def __init__(self, html, target_tree):
        doc = PyQuery(html)
        self._result = {}
        self._parse(target_tree, doc)

    @property
    def result(self):
        return self._result

    def _parse(self, pth, parent):
        last = pth[-1]
        if isinstance(last, list):
            var = self._assignment([_.identity for _ in pth[:-1]], parent)
            self._loop(last, var)
        else:
            self._save_result(
                parent,
                last.identity,
                last.html_element_attribute,
                last.field_name
            )

    def _loop(self, pth_list, parent):
        for pth in pth_list:
            self._parse(pth, parent)

    def _judge(self):
        pass

    @staticmethod
    def _assignment(pth, parent_var):
        var = None
        for child in pth:
            var = parent_var(child)
        return var

    def _save_result(self, parent, identity, property_name, field):
        element = parent(identity)
        if property_name == 'text':
            self._result[field] = element.text()
        else:
            self._result[field] = element.attr(property_name)
