#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
    hack by djj -_,- | good luck!
    date: 2018-02-10
"""
from flask import Blueprint, render_template, url_for

from core.html_marker import TOKEN_ID


selector = Blueprint('selector', __name__)


@selector.route('/', methods=['GET'])
def index():
    return render_template(
        'index.html',
        mark_api=url_for('sample.mark'),
        parse_api=url_for('sample.parse'),
        token_id=TOKEN_ID
    )
