#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
    hack by djj -_,- | good luck!
"""
from flask import Flask
from flask_bootstrap import Bootstrap
from api import api
from view import view

app = Flask(__name__)
app.debug = True
app.secret_key = 'hahahahahahahaha'
app.port = 11203
app.register_blueprint(api, url_prefix='/api')
app.register_blueprint(view)
bootstrap = Bootstrap(app)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=11203)
