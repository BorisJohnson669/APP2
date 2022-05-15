"""
 Application of Programming Principles
 Assignment Formative tasks Template 2021-22 - Flask & Python
 
"""
from flask import Flask, render_template, jsonify, request, make_response
from flask_cors import CORS, cross_origin
import json
import datetime

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/')
def home():
    """
        This code returns the index page to the browser. 
    """
    return render_template('index.html')


@app.route('/api/v1/books/all', methods=['GET'])
def books():
    """
        This code returns a list of books as a json object.
    """
    books = list()
    with open('data/books.json') as json_file:
        books = json.load(json_file)
    response = jsonify(books)
    return response


@app.route('/api/v1/books/book-of-the-day', methods=['GET'])
def book_of_the_day():
    """
        This code returns the book of the day.
    """
    books = list()
    with open('data/books.json') as json_file:
        books = json.load(json_file)
    if len(books) == 0:
        return jsonify({'message': 'No books found'})
    today = datetime.datetime.now().day
    book_of_the_day = books[today % len(books)]
    response = jsonify(book_of_the_day)
    return response


@app.route('/api/v1/books', methods=['POST'])
@cross_origin()
def add_book():
    books = []
    with open('data/books.json') as json_file:
        books = json.load(json_file)

    data = request.json

    title = data['title']
    author = data['author']
    isbn = data['isbn']
    date = data['date']

    for book in books:
        if book['isbn'] == isbn:
            return jsonify({'error': "The ISBN is already used."})

    books.append({
        "isbn": isbn,
        "title": title,
        "author": author,
        "date": date
    })

    with open('data/books.json', 'w') as json_file:
        json.dump(books, json_file)

    response = jsonify({'success': 'The book has been added successfully!'})
    return response


@app.route('/api/v1/books/<string:isbn>', methods=['DELETE'])
def delete_quote(isbn):
    books = []
    with open('data/books.json') as json_file:
        books = json.load(json_file)
    response = jsonify({'error': 'ISBN not found!'})
    for book in books:
        if book["isbn"] == isbn:
            books.remove(book)
            response = jsonify(
                {'success': 'The book has been successfully deleted!'})
            break

    with open('data/books.json', 'w') as json_file:
        json.dump(books, json_file)

    return response


# run app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
