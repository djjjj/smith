class TarGetNode:

    def __init__(self, nid, val_from, d='', key='', children=[], tp='',match_reg=''):
        self.node_type = tp
        self.id = nid
        self.dimension = d
        self.key = key
        self.val_from = val_from
        self.children = children
        self.match_reg = match_reg
