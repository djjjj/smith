import re

from pyquery import PyQuery as pq

from html_node import Node


class Worker:

    def __init__(self, file_obj, target_result):
        self.node_list = []
        t_dict, t_list = self.parse_target_result(target_result)
        self.target_list = t_list
        self.target_dict = t_dict
        self.doc = pq(file_obj)
        self.create(self.doc, Node(0, None, self.doc, 0), 0)

    def show(self):
        for item in self.node_list:
            if len(pq(item.label).children()) < 2:
                if item.label_text:
                    print item.id, item.label_text

    def create(self, label, pre, index):
        n = Node(len(self.node_list), pre, label, index)
        for i in pre.path:
            n.path.append(i)
        n.path.append(n.id)
        n.result_key = self.target_dict.get(str(n.id), None)
        self.node_list.append(n)
        for i, child in enumerate(label.children()):
            if pq(child).is_('script') or\
                    pq(child).is_('link') or\
                    pq(child).is_('style') or\
                    pq(child).is_('br') or\
                    pq(child).is_('head'):
                continue
            self.create(pq(child), n, i)

    def target_tree(self):
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
                    tmp = []
                    tmp.append(l1[i:])
                    tmp.append(l2[i:])
                    result.append(tmp)
                    break
                else:
                    result.append(item)
            return result

        path_list = [self.node_list[_].path for _ in self.target_list]
        the_tree = reduce(compare, path_list)
        return the_tree

    def parse_target_result(self, target_result):
        target_dict = {}

        def parse_json_recursively(node, pre):
            if isinstance(node, dict):
                for k, v in node.items():
                    parse_json_recursively(v, '%s_D|%s' % (pre, k))
            elif isinstance(node, list):
                for i, item in enumerate(node):
                    parse_json_recursively(item, '%s_L|' % pre)
            else:
                target_dict[str(node)] = '%s_S|' % pre

        parse_json_recursively(target_result, 'result')
        target_list = sorted([int(k) for k in target_dict])
        return target_dict, target_list
