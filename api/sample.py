#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
    hack by djj -_,- | good luck!
"""
from . import api


@api.route('/sample/<spider_id>', methods=['GET'])
def get_spider_list(spider_id):
