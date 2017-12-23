#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
    get_samples
    ~~~~~~~

    Module description here.

    :author: djj
    :copyright: (c) 2017, Tungee
    :date created: 2017-12-23
    :python version: 2.7
"""
from . import api


@api.route('/sample/<spider_id>', methods=['GET'])
def get_spider_list(spider_id):
