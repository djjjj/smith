# -*- coding: utf-8 -*-
import sys

from coder import Coder
from worker import Worker

reload(sys)
sys.setdefaultencoding('utf-8')

file_obj = open('rl_zp0005_2/7.html', 'r').read()
file_obj = unicode(file_obj, 'utf-8')

target_result = {
    'name': 1,
}
# test = [(6, u'注册号'), (21, u'注册日期')]
w = Worker(file_obj, target_result)
# for n in test:
    # w.node_list[n[0]].addition_key = n[1]
w.show()
print w.target_dict
print w.target_tree()
tree = w.target_tree()
c = Coder(tree, w.node_list, w.target_dict)
print c.result
