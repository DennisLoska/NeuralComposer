from flask import Flask, request
import json
import os
from pathlib import Path
import sys

app = Flask(__name__)

mydir = os.getcwd()
first = os.path.abspath(os.path.join(mydir, os.pardir))
second = os.path.abspath(os.path.join(first, os.pardir))
p = Path(second)
q = p / 'neuralstyletransfer'
sys.path.append(os.path.dirname(q))
from neuralstyletransfer import model

#
# The base64 encoded input and style image are received
# from the Node.js server and are being fed into the
# style transfer model. After the training process the model
# returns the result image and an array containing images from
# from previous epochs.
#
@app.route("/styleTransfer", methods=['GET', 'POST'])
def received():
    if (request.is_json):
        json_images = request.get_json()
        content = json_images['input']
        style = json_images['style']
        evolutionStep = 50 # determins the amount of evolutions
        styledImgB64, imageEvolutions = model.style_transfer_main(
            content, style, evolutionStep)
    return {"image": styledImgB64 , "list": json.dumps(imageEvolutions) }


if __name__ == '__main__':
    app.run(host='0.0.0.0',port='4002')
