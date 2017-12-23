# coding: utf-8
from lxml import html


TAG_FILTER = ['head', 'meta', 'link', 'script']


class NumId(object):
    start = 0

    def get_id(self):
        self.start += 1
        return self.start


def walk(doc):
    for child in doc.iterchildren():
        tag = child.tag
        if tag not in TAG_FILTER and len(child.getchildren()) < 2:
            try:
                child.set(key='tokenid', value='%s' % _id.get_id())
            except TypeError:
                pass
        else:
            pass
        walk(child)


html_str = open('/home/djj/956f2fca28e3810dd2aaf934e0949749.html').read()
doc = html.fromstring(html_str)
_id = NumId()
walk(doc)
out = open('seletor/tttt.html', 'w')
s = html.tostring(doc=doc)
out.write(s)
out.close()
