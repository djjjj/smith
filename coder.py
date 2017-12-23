import re


class Coder:

    def __init__(self, tree, node_list, result_dict):
        self._node_list = node_list
        self._tree = tree
        self.result_dict = result_dict
        self._var = -1
        self._now_i = []
        self._indent = 0
        self._last = None
        self._dimension_queue = []
        self._result = []
        self.init()
        self.run('doc', tree)

    def init(self):
        self.line_weaver('custom', **{'text': 'doc = pq(file_obj)'})
        key_list = re.findall('([a-zA-Z]*)_([LDS])\|', self.result_dict.items()[0][1])
        key_v, key_t = key_list[0]
        if key_v == 'result':
            r_type = '[]' if key_t == 'L' else '{}'
            self.line_weaver('custom', **{
                'text': 'result = %s' % r_type
            })
        tmp = {}
        for k, v in self.result_dict.items():
            key_list = re.findall('([a-zA-Z]*)_([LDS])\|', v)
            for key in key_list[1:]:
                if key[0] in tmp:
                    continue
                if key[1] == 'L':
                    self.line_weaver('custom', **{
                        'text': 'result["%s"] = []' % key[0]
                    })
                    tmp[key[0]] = None
                elif key[1] == 'D' and key[0]:
                    self.line_weaver('custom', **{
                        'text': 'result["%s"] = {}' % key[0]
                    })
                    tmp[key[0]] = None

    def line_weaver(self, t, **args):
        base = '%s' % (' ' * 4 * self._indent)
        line = None
        if t == 'create':
            if args['operation'] == '=':
                line = '%s%s = %s("%s")%s' % (
                    base,
                    args['var'],
                    args['pre'],
                    '").children("'.join(args['params']),
                    args['addition']
                )
            elif args['operation'].endswith('()'):
                line = '%s%s%s%s("%s")%s)' % (
                    base,
                    args['var'],
                    args['operation'][0:-1],
                    args['pre'],
                    '").children("'.join(args['params']),
                    args['addition']
                )
            line = re.sub('(\(\"\"\))+$', '', line)
        elif t == 'loop':
            var = self.var
            self.line_weaver(
                'custom',
                **{'text': 'tmp_%s = {}' % var}
            )
            line = '%sfor i_%s, child_%s in enumerate(%s.children()):' % (
                base,
                var,
                var,
                args['pre']
            )
            self._indent += 1
            self._now_i.append(var)
        elif t == 'judge':
            line = '%sif %s:' % (base, ' and '.join(args['conditions']))
            self._indent += 1
        elif t == 'custom':
            line = '%s%s' % (
                base,
                args['text']
            )
        self._result.append(line)

    @property
    def var(self):
        self._var += 1
        return self._var

    def run(self, pre, tree):
        if isinstance(tree[-1], list):
            pre = self.create(pre, tree[1:-1])
            self.loop(pre, tree[-1])
        else:
            if self._node_list[tree[-1]].addition_key:
                self.line_weaver('judge', **{
                    'conditions': ['pq(child_%s).prev().text() == u"%s"' % (self._now_i[-1], self._node_list[tree[-1]].addition_key)]
                })
            else:
                self.line_weaver('judge', **{
                    'conditions': ['i_%s == %s' % (self._now_i[-1], self._node_list[tree[-1]].index)]
                })

            self._dimension_queue.extend(re.findall(
                '([a-zA-Z]*)_([LDS])\|',
                self.result_dict[str(tree[-1])]
            )[1:])
            k, t = self._dimension_queue.pop()
            if k:
                self.create(
                    pre,
                    [tree[-1]],
                    var='result["%s"]' % k,
                    addition='.text()'
                )
            else:
                self.create(
                    pre,
                    [tree[-1]],
                    var='tmp_%s["%s"]' % (self._now_i[-1], k),
                    addition='.text()'
                )
            self.line_weaver('custom', **{'text': 'continue'})
            self._indent -= 1

    def loop(self, pre, branch_list):
        args = {
            'pre': pre
        }
        self.line_weaver('loop', **args)
        flag = False
        for branch in branch_list:
            this = self._node_list[branch[0]].identity
            if self._last != this:
                if flag == True:
                    flag = False
                    self._indent += 1
                    self.line_weaver('custom', **{'text': 'continue'})
                    self._indent -= 1
                if this.startswith('.'):
                    self.line_weaver('judge', **{
                        'conditions': ['pq(child_%s).attr("class") == "%s"' % (self._now_i[-1], this[1:])]
                    })
                elif this.startswith('#'):
                    self.line_weaver('judge', **{
                        'conditions': ['pq(child_%s).attr("id") == "%s"' % (self._now_i[-1], this[1:])]
                    })
                elif this.startswith('<'):
                    self.line_weaver('judge', **{
                        'conditions': [
                            'pq(child_%s).is_("%s")' % (self._now_i[-1], this[1:])]
                    })
                flag = True
            elif self._last == this and flag == True:
                self._indent += 1
            self.run('pq(child_%s)' % self._now_i[-1], branch)
            self._last = this

            if flag:
                self._indent -= 1
        self._indent -= 1
        if len(self._dimension_queue) > 0:
            k, t = self._dimension_queue.pop()
            if t == 'L':
                self.line_weaver('custom', **{
                    'text': 'result["%s"].append(tmp_%s)' % (k, self._now_i[-1])
                })
            elif t == 'D':
                self.line_weaver('custom', **{
                    'text': 'result["%s"] = tmp_%s ' % (k, self._now_i[-1])
                })
        self._now_i.pop()

    def create(self, pre, node_list, operation='=', var='', addition=''):
        var = '_%s' % self.var if not var else var
        params = [
            re.sub('^\<', '', self._node_list[node].identity.replace(' ', '")(".'))
            for node in node_list
            if self._node_list[node].identity
        ]

        args = {
            'var': var,
            'pre': pre,
            'operation': operation,
            'params': params,
            'addition': addition
        }
        self.line_weaver('create', **args)
        return var

    @property
    def result(self):
        result = '\n'.join(self._result)
        return result
