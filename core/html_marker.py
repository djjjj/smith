# coding: utf-8
"""
    hack by djj -_,- | good luck!
"""
from lxml import html


class IdCreator(object):
    start = 0

    def get_id(self):
        self.start += 1
        return self.start

id_creator = IdCreator()

TAG_FILTER = ['head', 'meta', 'link', 'script']
TOKEN_ID = 'token_id'


def _walk(doc, level):
    child_levels = []
    for child in doc.iterchildren():
        child_level = _walk(child, level+1)
        child_levels.append(child_level)
        tag = child.tag
        if tag not in TAG_FILTER and child_level - level < 3:
            try:
                child.set(key=TOKEN_ID, value='%s' % id_creator.get_id())
            except TypeError:
                pass
        else:
            pass
    if child_levels:
        return max(child_levels)
    else:
        return level


def html_mark(in_f, out_f):
    html_str = open(in_f).read()
    doc = html.fromstring(html_str)
    _walk(doc, 0)
    with open(out_f, 'w') as out:
        out.write(html.tostring(doc=doc))
