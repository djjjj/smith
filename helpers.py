#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
    hack by djj -_,- | good luck!
    date: 2018-02-10
"""
import requests
from lxml import html

from core.target_tree import TargetTree
from core.parser import Parser
from core.html_marker import HtmlMarker


html_marker = HtmlMarker()


def mark_html(html_text):
    return html_marker.mark(html_text)


def parse_html(html_text, target_list):

    target_tree = TargetTree(html.fromstring(html_text), target_list).target_tree
    parser = Parser(html_text, target_tree)
    return parser.result


def mark_remote_file(url):
    html_text = 'this url can not connect'
    try:
        if not url.startswith('http://') or url.startswith('https://'):
            url = 'http://' + url
        rsp = requests.get(url, timeout=5)
        html_text = rsp.content
        return mark_html(html_text)
    except:
        return html_text
