from flask import Flask,request
import topic_modelling as tp
import sentiment_summary as ss
from flask_cors import CORS, cross_origin
import json


app = Flask(__name__)
CORS(app)
@app.route('/',  methods=['GET', 'POST'])

def home():
    parsed = json.loads(request.data)
    print (type(parsed));
    print (list(parsed));
    results = tp.summarize_reviews(parsed)
    return results


# def summary():
    # print('hello')
    # parse = json.loads(request.test)
    
    # print (tp.summarize_reviews("camera is bad,camera is good,batteries bad,Camera is good but batteries are bad,Batteries are dead"))

app.run(host='localhost',port=8001)