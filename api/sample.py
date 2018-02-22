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
        marked = mark_html(request.files['data'].read())
    elif input_type == 'url':
        marked = mark_remote_file(request.form['data'])
    elif input_type == 'text':
        marked = mark_html(request.form['data'])
    else:
        return jsonify(), 400
    marked = str(marked, encoding='utf-8')
    return jsonify(data=marked), 200


@sample_api.route('/parse', methods=['POST'])
def parse():
    target = json.loads(request.form['target'])
    html = request.form['data']

    result = parse_html(html, target)
    result = str(result, encoding='utf-8')
    return jsonify(data=result), 200
