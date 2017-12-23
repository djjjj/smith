# -*- encoding: utf8 -*-
import re
import sys

from pyquery import PyQuery as pq
from HtmlNode import HtmlNode
reload(sys)
sys.setdefaultencoding('utf8')


class HtmlTree:

    counter = 0
    node_map = {}
    node_identity_map = {}
    target_nodes = []
    target_tree = None

    def __init__(self, html_obj, target_nodes):
        html_obj = re.sub('<!--[\s\S]*?-->', '', html_obj)
        self._create(pq(html_obj))
        target_list = []
        for node in target_nodes:
            self.target_nodes.append(node)
            if node.node_type == '':
                target_list.append(node.id)
            for n in node.children:
                target_list.append(n.id)
                self.target_nodes.append(n)
        self.target_tree = self.create_target_tree(target_list)

    def show(self):
        sorted_dict = sorted(self.node_map.keys(), key=lambda k:int(k))
        for item in sorted_dict:
            v = self.node_map[item][0]
            if v.element_text and\
                    v.element_text.strip():
                print item, v.element_text

    def _create(self, pq_obj, pre=0, index=0, path=''):
        n = HtmlNode(pq_obj.outer_html(), pre, index)
        pre_identity = '%s%s->' % (path, n.identity)
        self.add_key_into_node_id_map(pre_identity)
        self.node_map[str(self.counter)] = (n, pre_identity)
        pre = self.counter
        self.counter += 1
        for i, child in enumerate(pq_obj.children()):
            child = pq(child)
            if child.is_('script') or\
                    child.is_('head') or\
                    child.is_('meta') or\
                    child.is_('style') or\
                    child.is_('link') or\
                    child.is_('img'):
                continue
            self._create(pq(child), pre, i, pre_identity)

    def create_target_tree(self, target_nodes):
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

        path_list = []
        for node in target_nodes:
            path = [node]
            while node != '0':
                node = str(self.node_map[node][0].element_pre)
                path.insert(0, node)
            path_list.append(path)
        the_tree = reduce(compare, path_list)
        return the_tree

    def add_key_into_node_id_map(self, key):
        if key in self.node_identity_map:
            self.node_identity_map[key] += 1
        else:
            self.node_identity_map[key] = 1
