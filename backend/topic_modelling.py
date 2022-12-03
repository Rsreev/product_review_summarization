import pandas as pd
import re
import spacy
from bs4 import BeautifulSoup
from keras.preprocessing.text import Tokenizer 
#from tensorflow.keras.utils import pad_sequences
from nltk.corpus import stopwords
#from tensorflow.keras.layers import Input, LSTM, Embedding, Dense, Concatenate, TimeDistributed
#from tensorflow.keras.models import Model
#from tensorflow.keras.callbacks import EarlyStopping
import warnings
from sklearn.metrics.pairwise import cosine_similarity
import nltk
#nltk.download('stopwords')
from textblob import TextBlob
from collections import Counter
from sentence_transformers import SentenceTransformer
import umap.umap_ as umap
import hdbscan
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer

def test():
    return "Hello test"


    

contractions = { 
"ain't": "am not",
"aren't": "are not",
"can't": "cannot",
"can't've": "cannot have",
"'cause": "because",
"could've": "could have",
"couldn't": "could not",
"couldn't've": "could not have",
"didn't": "did not",
"doesn't": "does not",
"don't": "do not",
"hadn't": "had not",
"hadn't've": "had not have",
"hasn't": "has not",
"haven't": "have not",
"he'd": "he would",
"he'd've": "he would have",
"he'll": "he will",
"he's": "he is",
"how'd": "how did",
"how'll": "how will",
"how's": "how is",
"i'd": "i would",
"i'll": "i will",
"i'm": "i am",
"i've": "i have",
"isn't": "is not",
"it'd": "it would",
"it'll": "it will",
"it's": "it is",
"let's": "let us",
"ma'am": "madam",
"mayn't": "may not",
"might've": "might have",
"mightn't": "might not",
"must've": "must have",
"mustn't": "must not",
"needn't": "need not",
"oughtn't": "ought not",
"shan't": "shall not",
"sha'n't": "shall not",
"she'd": "she would",
"she'll": "she will",
"she's": "she is",
"should've": "should have",
"shouldn't": "should not",
"that'd": "that would",
"that's": "that is",
"there'd": "there had",
"there's": "there is",
"they'd": "they would",
"they'll": "they will",
"they're": "they are",
"they've": "they have",
"wasn't": "was not",
"we'd": "we would",
"we'll": "we will",
"we're": "we are",
"we've": "we have",
"weren't": "were not",
"what'll": "what will",
"what're": "what are",
"what's": "what is",
"what've": "what have",
"where'd": "where did",
"where's": "where is",
"who'll": "who will",
"who's": "who is",
"won't": "will not",
"wouldn't": "would not",
"you'd": "you would",
"you'll": "you will",
"you're": "you are"
}

def clean_text(text, remove_stopwords = True):
    '''Remove unwanted characters, stopwords, and format the text to create fewer nulls word embeddings'''
    
    # Convert words to lower case
    text = text.lower()
    
    # Replace contractions with their longer forms 
    if True:
        text = text.split()
        new_text = []
        for word in text:
            if word in contractions:
                new_text.append(contractions[word])
            else:
                new_text.append(word)
        text = " ".join(new_text)
    
    # Format words and remove unwanted characters
    text = re.sub(r'https?:\/\/.*[\r\n]*', '', text, flags=re.MULTILINE)
    text = re.sub(r'\<a href', ' ', text)
    text = re.sub(r'&amp;', '', text) 
    text = re.sub(r'[_"\-;%()|+&=*%.,!?:#$@\[\]/]', ' ', text)
    text = re.sub(r'<br  ><br  >', ' ', text)
    text = re.sub(r'<br  >', ' ', text)
    text = re.sub(r'\'', ' ', text)
    text = re.sub(r'\\',' ', text)
    
    # Optionally, remove stop words
    if remove_stopwords:
        text = text.split()
        stops = set(stopwords.words("english"))
        text = [w for w in text if not w in stops]
        text = " ".join(text)

    return text

def topic_create(clean_texts):
    model = SentenceTransformer('distilbert-base-nli-mean-tokens')
    embeddings = model.encode(clean_texts, show_progress_bar=False)
    umap_embeddings = umap.UMAP(n_neighbors=15, 
                            n_components=2, 
                            metric='cosine').fit_transform(embeddings)
    cluster = hdbscan.HDBSCAN(min_cluster_size=15,
                          metric='euclidean',                      
                          cluster_selection_method='eom').fit(umap_embeddings)
    # Prepare data
    umap_data = umap.UMAP(n_neighbors=15, n_components=2, min_dist=0.0, metric='cosine').fit_transform(embeddings)
    result = pd.DataFrame(umap_data, columns=['x', 'y'])
    result['labels'] = cluster.labels_
    docs_df = pd.DataFrame(clean_texts, columns=["Doc"])
    docs_df['Topic'] = cluster.labels_
    docs_df['Doc_ID'] = range(len(docs_df))
    docs_per_topic = docs_df.groupby(['Topic'], as_index = False).agg({'Doc': ' '.join})
    return docs_per_topic , docs_df

def c_tf_idf(documents, m, ngram_range=(1, 1)):
    count = CountVectorizer(ngram_range=ngram_range, stop_words="english").fit(documents)
    t = count.transform(documents).toarray()
    w = t.sum(axis=1)
    tf = np.divide(t.T, w)
    sum_t = t.sum(axis=0)
    idf = np.log(np.divide(m, sum_t)).reshape(-1, 1)
    tf_idf = np.multiply(tf, idf)

    return tf_idf, count

def extract_top_n_words_per_topic(tf_idf, count, docs_per_topic, n=20):
    words = count.get_feature_names()
    labels = list(docs_per_topic.Topic)
    tf_idf_transposed = tf_idf.T
    indices = tf_idf_transposed.argsort()[:, -n:]
    top_n_words = {label: [(words[j], tf_idf_transposed[i][j]) for j in indices[i]][::-1] for i, label in enumerate(labels)}
    return top_n_words

def extract_topic_sizes(df):
    topic_sizes = (df.groupby(['Topic'])
                     .Doc
                     .count()
                     .reset_index()
                     .rename({"Topic": "Topic", "Doc": "Size"}, axis='columns')
                     .sort_values("Size", ascending=False))
    return topic_sizes

def summarization(clean_texts,topic_sizes):
    nlp = spacy.load("en_core_web_sm")
    aspects = {}
    count = {}
    for sentence in clean_texts:
        doc = nlp(sentence)
        target = ''
        descriptive_term = ''
        flag = 0
        for token in doc:
            if token.dep_ == 'nsubj' or token.pos_ == 'NOUN':
                target = token.text
            if token.pos_ == 'ADJ':
                prepend = ''
                for child in token.children:
                    if child.pos_ != 'ADV':
                        continue
                    prepend += child.text + ' '
                descriptive_term = prepend + token.text
                if target not in aspects and target != '' and descriptive_term != '':
                    aspects[target] = [descriptive_term]
                    count[target] = 1
                    flag = 1
                elif target in aspects and descriptive_term != '':
          
                    aspects[target] = aspects[target] + [descriptive_term]
                    count[target] += 1
                    flag = 1
                
        if target not in aspects and target != '' and flag!=1 and descriptive_term != '':
            aspects[target] = [descriptive_term]
            count[target] = 1
        elif target in aspects and flag!=1 and descriptive_term != '':
            aspects[target] = aspects[target] + [descriptive_term]
            count[target] += 1
    assort = sorted(count.items(), key=lambda x:x[1],reverse=True)
    new = assort[:10]
    lists = []
    for j in new:
        sum = 0
        overall = 0
        for i in aspects[j[0]]:
            sum = sum + TextBlob(i).sentiment.polarity
        overall = sum / len(aspects[j[0]])
        if overall <0:
            sentiment = 'negative'
        elif overall == 0:
            sentiment = 'neutral'
        else:
            sentiment = 'positive'
        aspects[j[0]] = [sentiment] + aspects[j[0]] 
    newhash = []
    sentiment = []
    hashmap = dict()
    for i in new:
        lis  = []
        
        sentiment = aspects[i[0]][0]
        x = Counter(aspects[i[0]])
        for j in range(0,4):
            if j > len(x)-1:
                lis = lis + ['None']
            elif x.most_common()[j][0] != sentiment:
                lis = lis + [x.most_common()[j][0]]
        lis = lis + [sentiment]
        #newhash = newhash + [lis]
        hashmap[i[0]]=lis

    #print (type(hashmap))
    #print (hashmap)
    return hashmap
    
def summarize_reviews(reviews):
    #main function to create the results
    # Clean the texts
    clean_texts = []
    for text in reviews:
        clean_texts.append(clean_text(text))
    docs_per_topic,docs_df = topic_create(clean_texts)
    tf_idf, count = c_tf_idf(docs_df.Doc.values, m=len(reviews))
    top_n_words = extract_top_n_words_per_topic(tf_idf, count, docs_per_topic, n=20)
    topic_sizes = extract_topic_sizes(docs_df); topic_sizes.head(10)
    topic_sizes =10
    results = summarization(clean_texts,topic_sizes)
    return results

def generate_summary(results):
    stringresult ="the overall summary from reviews are"
    sentiment = []
    for i in results:
        stringresult = stringresult+","+str(i)+ " "+ str(results[i][0])
        sentiment = sentiment+[results[i][3]]
    stringresult = stringresult+","+"overall"+max(sentiment)+"product"
    return stringresult
