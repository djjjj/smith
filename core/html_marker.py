# coding: utf-8
"""
    hack by djj -_,- | good luck!
"""
from lxml import html


class IdCreator(object):

    def __init__(self):
        self.start = 0

    def get_id(self):
        self.start += 1
        return self.start


TAG_FILTER = ['head', 'meta', 'link', 'script']
TOKEN_ID = 'token_id'


class HtmlMarker(object):

    def __init__(self):
        self.id_creator = None

    def _walk(self, doc, level):
        child_levels = []
        for child in doc.iterchildren():
            child_level = self._walk(child, level+1)
            child_levels.append(child_level)
            tag = child.tag
            if tag not in TAG_FILTER and child_level - level < 3:
                try:
                    child.set(key=TOKEN_ID, value='%s' % self.id_creator.get_id())
                except TypeError:
                    pass
            else:
                pass
        if child_levels:
            return max(child_levels)
        else:
            return level

    def html_mark(self, in_f, out_f):
        html_str = open(in_f).read()
        with open(out_f, 'w') as out:
            out.write(self.mark(html_str))

    def mark(self, in_html):
        self.id_creator = IdCreator()
        doc = html.fromstring(in_html)
        self._walk(doc, 0)
        return html.tostring(doc=doc)
