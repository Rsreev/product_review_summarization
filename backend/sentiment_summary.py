import nltk
nltk.download('punkt')
from nltk.tokenize import sent_tokenize
import torch
from pytorch_pretrained_bert import BertTokenizer, BertModel
from sklearn.cluster import KMeans
from sklearn.cluster import KMeans
from sklearn.metrics import pairwise_distances_argmin_min
import numpy as np
import pandas as pd
import re
import json
import time
import datetime
import tensorflow as tf
import torch
from torch import nn, optim
from torch.utils.data import Dataset, DataLoader

from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, classification_report

from collections import defaultdict
import seaborn as sns
from scipy.stats import norm
from scipy.stats import chi2_contingency
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers import AutoTokenizer, TFAutoModelForSeq2SeqLM
import torch
import requests
from bs4 import BeautifulSoup
import re
#%matplotlib inline
import matplotlib.pyplot as plt
from tqdm import tqdm

RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)
torch.manual_seed(RANDOM_SEED)

access_token = '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' 

device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

def summarize(review):
    sent = preprocess(review)
    print(sent)
    score = sentiment_score(sent)
    print(score)
    output = generate_summary(sent, score)
    print(output)
    return output


emoticon_repl = {
    # positive emoticons
    r":-?d+": " good ", # :D, :-D, :DD, ecc. in lower case
    r":[- ]?\)+": " good ", # :-), :), :-)), :)), ecc
    r";-?\)+": " good ", # ;). ;)). ;-), ecc.
    r"\(+-?:": " good ", # (:, (-:, ecc.
    r"=\)+" : " good ",
    r"\b<3\b" : " good ",    
    # negative emoticons
    r"[\s\r\t\n]+:/+": " bad ", # :/
    r":\\+": " bad ", # :\
    r"[\s\r\t\n]+\)-?:": " bad ",  # ):, )):, )-:, ecc.
    r":-?\(+": " bad ", # :(, :-(, :((, ecc.
    r"[\s\t\r\n]+d+-?:": " bad "
}

slang_repl = {
    "tbh" : "to be honest", "afaik" : "as far as i know",
    "ama" : "ask me anything", "b4" : "before",
    r"baa+d" : " bad ", "brb" : "be right back",
    "btaim" : "be that as it may", "bts" : "behind the scenes",
    "btw" : "by the way", "dyk" : "did you know",
    "eli5" : "explain like i am five", "fomo" : "fear of missing out",
    "ftfy" : "fixed that for you", "ftw" : "for the win",
    "fyi" : "for your information", "g2g" : "got to go",
    r"gooo+d": " good ", "gtg" : "got to go",
    "gg" : "good game", r"gr8t*": " great ",
    "gtr" : "got to run", "hmb" : "hit me back",
    "hmu" : "hit me up", "hth" : "happy to help",
    "icymi" : "in case you missed it", "idc" : "i do not care",
    "idk" : "i do not know", "ikr" : "i know right",
    "ily" : "i love you", "imho" : "in my humble opinion",
    "imo" : "in my opinion", "irl" : "in real life",
    "jk" : "just kidding", "lmao" : "laughing my ass off",
    "lmk" : "let me know", "lol" : "laughing out loud",
    "mfw" : "my face when", "nbd" : "no big deal",
    "nm" : "not much", "nvm" : "never mind",
    "omw" : "on my way", "op" : "original poster",
    "ppl" : "people", "rofl" : "rolling on the floor laughing",
    "roflmao" : "rolling on the floor laughing my ass off", "smh" : "shaking my head",
    "tbbh" : "to be brutally honest", "tfw" : "that feeling when",
    "til" : "today i learned", "tmi" : "too much information",
    "wbu" : "what about you", "yolo" : "you only live once"  
}

#slang_keys = list(slang_repl.keys())
#present_slang = [k for k in tqdm(slang_keys) if check_presence(r"\b"+k+r"\b", verbose = False)]
#slang_repl_subset = {k : slang_repl[k] for k in present_slang}
#set(slang_repl.keys())-set(slang_repl_subset.keys())
#slang_repl = slang_repl_subset


contracted_repl = {
    # casi particolari
    r"won\'t" : "will not", r"won\'" : "will not",
    r"can\'t": "can not", r"shan\'t": "shall not",
    r"shan\'": "shall not", r"ain\'t": "is not",
    r"ain\'": "is not",
    # casi generali
    r"n\'t": " not",
    r"n\'": " not",
    r"\'s": " is",
    r"\'ve": " have", 
    r"\'re": " are", 
    r"\'ll": " will", # Might also be "shall", in any case both will be considered stop words
    r"\'d": " would", # Might also be "had", in any case both will be considered stop words
}


def preprocess(sent):
    
    sent = sent.lower()
    sent = re.sub(r'^<div id="video.*>&nbsp;', '', sent) # Video-review part
    sent = re.sub('https?://[A-Za-z0-9./]+', '', sent) # URLs
    
    for k in emoticon_repl:
        sent = re.sub(k, emoticon_repl[k], sent)
        
    for k in contracted_repl:
        sent = re.sub(k, contracted_repl[k], sent)
    
    sent = re.sub('[/]+', ' ', sent) # word1/word2 to word1 word2
    # Remove non-alphanumeric characters (but not - and _, might be useful for tokenization)
    sent = re.sub('[^A-Za-z0-9-_ ]+', '', sent)

    # Remove words that are digits only
    sent = re.sub('\b\d+\b', '', sent)
    
    return sent

def sentiment_score(sent):
	tokenizer = AutoTokenizer.from_pretrained('nlptown/bert-base-multilingual-uncased-sentiment',truncation=True, max_length=512)
	model = AutoModelForSequenceClassification.from_pretrained('nlptown/bert-base-multilingual-uncased-sentiment')
	tokens = tokenizer.encode(sent, return_tensors='pt', add_special_tokens=True,max_length=510, truncation=True)
	result = model(tokens)
	score = int(torch.argmax(result.logits)) + 1
	return score

def generate_summary(sent, score):
    threshold = 3
    model_name = 'Premchand23/t5-small-summarization'
    tokenizer = AutoTokenizer.from_pretrained(model_name, use_auth_token=access_token)
    model = TFAutoModelForSeq2SeqLM.from_pretrained(model_name, use_auth_token=access_token)

    if 't5' in model_name: 
        sent = "summarize: " + sent
    tokenized = tokenizer([sent], return_tensors='np')
    out = model.generate(**tokenized, max_length=128)
    with tokenizer.as_target_tokenizer():
        summary = tokenizer.decode(out[0], skip_special_tokens=True)
        return summary

if __name__ == '__main__':
    generate_summary("camera is bad,camera is good,batteries bad,Camera is good but batteries are bad,Batteries are dead")
    
