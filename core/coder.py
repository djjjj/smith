#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
    hack by djj -_,- | good luck!
"""


class Coder(object):

    INDENT = '    '
    VAR = 'var'
    CHILD = 'child'

    def __init__(self, target_tree):
        self._var_counter = 0
        self._indent_counter = 0
        self._var_child_counter = 0
        self._codes = [
            '#!/usr/bin/env python',
            '# -*- coding: utf-8 -*-',
            '"""',
            '    hack by djj -_,- | good luck!',
            '"""',
            'import sys',
            'from pyquery import PyQuery as pq',
            '',
            '',
            'html = open(sys.argv[1]).read()',
            'result = {}',
            'doc = pq(html)',

        ]
        self._code(target_tree, 'doc')

    @property
    def _var(self):
        var = '%s%s' % (self.VAR, self._var_counter)
        self._var_counter += 1
        return var

    @property
    def _indent(self):
        indent = self.INDENT * self._indent_counter
        return indent

    @property
    def _var_child(self):
        var = '%s%s' % (self.CHILD, self._var_child_counter)
        self._var_child_counter += 1
        return var

    def _code(self, pth, parent):
        var = self._assignment([_.identity for _ in pth[:-1]], parent)
        last = pth[-1]
        if isinstance(last, list):
            self._loop(last, var)
        else:
            self._save_result(
                var,
                last.identity,
                last.html_element_attribute,
                last.field_name
            )

    def _loop(self, pth_list, parent):
        # code = '%sfor %s in %s.children()'
        # var_child = self._var_child
        # self._codes.append(code % (self._indent, var_child, parent))
        # self._indent_counter += 1
        for pth in pth_list:
            self._code(pth, parent)

    def _judge(self):
        pass

    def _assignment(self, pth, parent_var):
        code = '%s%s = %s'
        var = self._var
        main = parent_var
        for child in pth:
            main += "('%s')" % child
        self._codes.append(code % (self._indent, var, main))
        return var

    def _save_result(self, parent, indentity, property_name, field):
        code = 'result["%s"] = %s'
        element = "%s('%s')" % (parent, indentity)
        if property_name == 'text':
            code = code % (field, '%s.text()' % element)
        else:
            code = code % (field, '%s.attr("%s")' % (element, property_name))
        self._codes.append(code)
