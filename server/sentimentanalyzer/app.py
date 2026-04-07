from flask import Flask, jsonify
from textblob import TextBlob

app = Flask(__name__)


@app.route('/analyze/<text>', methods=['GET'])
def analyze_review(text):
    analysis = TextBlob(text)
    polarity = analysis.sentiment.polarity
    if polarity > 0:
        sentiment = 'positive'
    elif polarity < 0:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'
    return jsonify({'sentiment': sentiment, 'polarity': polarity})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050)
