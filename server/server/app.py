
from flask import Flask, request, render_template, url_for, redirect
import requests
import base64
import json
import os 
import os.path
from pathlib import Path
import sys

app = Flask(__name__)

mydir = os.getcwd()
first =os.path.abspath(os.path.join(mydir, os.pardir))
second = os.path.abspath(os.path.join(first, os.pardir))
p = Path(second)
q = p / 'neuralstyletransfer'
sys.path.append( os.path.dirname(q))
from neuralstyletransfer import model 


@app.route("/post", methods = ['GET', 'POST'])
def received():
    if (request.is_json):

        #content [0] & style[1]
        json_images = request.get_json()
        content = json_images['input']
        style = json_images['style']
        base64return = model.style_transfer_main(content, style)
    return base64return

@app.route('/')
def hello():
    return "Hello World!"

if __name__ == '__main__':
    app.run(host='0.0.0.0',port='4002')
