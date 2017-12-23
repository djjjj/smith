from PythonCoder import PythonCoder

class Coder:

    coder = None
    node_map = {}
    indent = 0
    codes = []
    indent_char = '    '
    target_dict = {}

    def __init__(self, html_tree):
        self.node_map = html_tree.node_map
        self.target_dict = {_.id: _ for _ in html_tree.target_nodes}
        self.read_tree(html_tree.target_tree)
        pass

    def read_tree(self, target_tree, pre_var_name='doc'):
        branch = []
        for node in target_tree[:-1]:
            branch.append(node)
        node = target_tree[-1]

        if isinstance(node, list):
            var_name = self.weare_assignment_code(pre_var_name, branch)
            loop_indent = self.indent
            child_name = self.weare_loop_code(var_name)
            for branch in node:
                judge_indent = self.indent
                self.weare_judge_code(child_name, branch)
                self.read_tree(branch, child_name)
                self.indent = judge_indent
            self.indent = loop_indent
        else:
            var_name = self.weare_assignment_code(
                pre_var_name,
                target_tree,
                'result["%s"]' % self.target_dict[str(node)].dimension,
                '.%s' % self.target_dict[str(node)].val_from
            )

    def weare_assignment_code(self, pre_var_name, branch, var_name=None, val_from=''):
        base_code = '%s = %s%s'
        if not var_name:
            var_name = 'var_%s' % self.indent
        pyquery_code = self.join_identity(pre_var_name, branch)
        self.save_code(base_code % (var_name, pyquery_code, val_from))
        return var_name

    def weare_loop_code(self, var_name, match='', key=None, val=None):
        code_list = []
        base_code = 'for i, %s in enumerate(%s.children()):'
        child_name = 'child_%s' % self.indent
        self.save_code(base_code % (child_name, var_name))
        self.indent += 1
        self.save_code('%s = pq(%s)' % (child_name, child_name))
        if match:
            code_list.append('match = re.match(u"%s", %s.text())' % (match, child_name))
            code_list.append('key, val = match.groups() if match else continue')
        if key:
            code_list.append('key = %s' % key)
        if val:
            code_list.append('val = %s' % val)
        return child_name

    def weare_judge_code(self, var_name, branch):
        identity = self.node_map[branch[0]][0].identity
        identity_key = identity['identity_key']
        identity_val = identity['identity_val']
        if identity_key == 'id':
            self.save_code('if %s.attr("id") == "%s":' % (var_name, identity_val))
        elif identity_key == 'class':
            self.save_code('if %s.attr("class") == "%s":' % (var_name, identity_val))
        elif identity_key == 'label':
            self.save_code('if %s.is_("%s"):' % (var_name, identity_val))
        self.indent += 1

    def join_identity(self, pre_var_name, node_list):
        tmp = ''
        for node in node_list:
            identity = self.node_map[node][0].identity
            identity_key = identity['identity_key']
            identity_val = identity['identity_val']
            if identity_key == 'id':
                tmp += '("#%s")' % identity_val
            elif identity_key == 'class':
                tmp += '(".%s")' % identity_val.replace('")(".', ' ')
            else:
                tmp += '("%s")' % identity_val
        return '%s%s' % (pre_var_name, tmp)

    def save_code(self, code_line):
        self.codes.append('%s%s' % (self.indent * self.indent_char, code_line))
