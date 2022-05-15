class API {
    // API URL
    static URL = "http://localhost:5000/api/v1/";

    /**
     * This method is used to make an API request
     * for the given uri and method. 
     * It will call the callback function with the returned data.
     */
    static sendRequest(uri, method, callback, data) {
        function onLoad() {
            const response = JSON.parse(this.responseText);
            if (response?.error) alert(response.error);
            callback(response);
        }
        let oReq = new XMLHttpRequest();
        oReq.addEventListener("load", onLoad);
        oReq.open(method, API.URL + uri);
        if (!data) return oReq.send();
        data = JSON.stringify(data);
        oReq.setRequestHeader("Content-Type", "application/json");
        oReq.send(data);
    }
    
    /**
     * This static method will get all the books
     * and will dispatch the callback with the
     * list of books.
     */
    static getAllBooks(callback) {
        API.sendRequest("books/all", "GET", callback);
    }

    /**
     * This static method will get the book of the day
     * and call the callback with the result.
     */
    static getBookOfTheDay(callback) {
        API.sendRequest("books/book-of-the-day", "GET", callback);
    }

    /**
     * This static method will add a book to the list
     * of books saved in the API's database.
     */
    static addBook(callback, data) {
        if (!data) return console.error("Data is empty.");
        API.sendRequest("books", "POST", callback, data);
    }

    /**
     * This function will delete the book 
     * with the given isbn.
     */
    static deleteBook(callback, isbn) {
        if (!isbn) return console.error("ISBN is empty.");
        API.sendRequest("books/" + isbn, "DELETE", callback);
    }

}