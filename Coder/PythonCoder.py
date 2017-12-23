class PythonCoder:

    codes = []
    indent_char = '  '
    indent = 0

    def write_codes_block(code_list):
        start_indent = self.indent
        var_index = 0
        for code in code_list:
            code_type = code['type']
            code_str = ''
            if code_type == 'assignment':
                code_str = self.write_assignment_express(var_index, code['args'])
            elif code_type == 'judge':
                code_str = self.write_judge_express(var_index, code['args'])
                self.indent += 1
            elif code_type == 'loop':
                code_str = self.write_loop_express(var_index)
                self.indent += 1
            var_index += 1
            codes.append(code_str)
        self.indent = start_indent

    def write_assignment_express(var_index, args):
        base_code = '%svar_%s = %s'
        return base_code % (indent_char * self.indent, var_index, args[0])

    def write_judge_express(var_index, args):
        base_code = '%sif var_%s is %s:'
        return base_code % (indent_char * self.indent, var_index, args[1])

    def write_loop_express(var_index, key=None, val=None):
        codes = [
            'for i, child_%s in enumerate(var_%s.children()):',
            'child_%s = pq(child_%s)',
        ]

        if key:
            codes.append('key = %s')
        if val:
            codes.append('val = %s')
        return codes
