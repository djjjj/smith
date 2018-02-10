#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
    hack by djj -_,- | good luck!
"""
from flask import Blueprint

sample_api = Blueprint('sample', __name__, url_prefix='/api')

from . import sample
