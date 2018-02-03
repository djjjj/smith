# coding: utf-8
from lxml import html


TAG_FILTER = ['head', 'meta', 'link', 'script']


class NumId(object):
    start = 0

    def get_id(self):
        self.start += 1
        return self.start


def walk(doc, level):
    child_levels = []
    for child in doc.iterchildren():
        child_level = walk(child, level+1)
        child_levels.append(child_level)
        tag = child.tag
        if tag not in TAG_FILTER and child_level - level < 3:
            try:
                child.set(key='token_id', value='%s' % _id.get_id())
            except TypeError:
                pass
        else:
            pass
    if child_levels:
        return max(child_levels)
    else:
        return level


html_str = open('/home/djj/abc.html').read()
doc = html.fromstring(html_str)
_id = NumId()
walk(doc, 0)
out = open('seletor/tttt.html', 'w')
s = html.tostring(doc=doc)
out.write(s)
out.close()
