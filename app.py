#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
    hack by djj -_,- | good luck!
"""
from flask import Flask, redirect, url_for

from api import sample_api
from selector import selector

app = Flask(__name__)
app.debug = True
app.secret_key = 'hahahahahahahaha'
app.port = 11203
app.register_blueprint(sample_api)
app.register_blueprint(selector)


@app.route('/', methods=['GET'])
def index():
    return redirect(url_for('selector'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9999)
