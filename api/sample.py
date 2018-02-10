#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
    hack by djj -_,- | good luck!
"""
import json
from flask import request, jsonify

from helpers import mark_html, parse_html, mark_remote_file
from . import sample_api


@sample_api.route('/<spider_id>', methods=['GET'])
def get_spider_list(spider_id):
    pass


@sample_api.route('/mark', methods=['POST'])
def mark():
    input_type = request.form['type']
    if input_type == 'file':
        data = request.files['data'].read()
        marked = mark_html(data)
    elif input_type == 'url':
        data = request.form['data']
        marked = mark_remote_file(data)
    else:
        return jsonify(), 400
    return jsonify(data=marked), 200


@sample_api.route('/parse', methods=['POST'])
def parse():
    target = json.loads(request.form['target'])
    html = request.form['data']

    result = parse_html(html, target)

    return jsonify(data=result), 200
