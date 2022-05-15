/**
 * Application of Principles of Programming
 * Assignment Template 2021 - Javascript
 * @author FULL NAME
 */

let books = [];
const setBooks = (data) => {
  books = data;
  displayBooks();
}

const SmallBook = ({ title, author }) => `
    <h3>${title}</h3>
    <p><strong>AUTHOR:</strong> ${author}</p>
`;

const DetailedBook = ({ title, author, isbn, date }) => `
    <h3>${title}</h3>
    <p><strong>AUTHOR:</strong> ${author}</p>
    <p><strong>ISBN:</strong> ${isbn}</p>
    <p><strong>RELEASE DATE:</strong> ${date}</p>
`;

const Card = (content, isbn) => `
    <div id="card" isbn="${isbn}">
      <div id="book">
        ${content}
      </div>
      <button id="delete"> Delete </button>
      <button id="show-more"> Show More </button>
      <button style="display: none" id="show-less"> Show Less </button>
    </div>
`;


document.addEventListener("DOMContentLoaded", function () {
  API.getAllBooks(setBooks);
  API.getBookOfTheDay(book => {
    if(book.isbn)
      document.querySelector("#book-of-the-day").innerHTML = DetailedBook(book);
  });
});

//utility functions - DO NOT EDIT OR DELETE
function getUniqueKey() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
};

// Event listener on add button
document.querySelector("#btnAddEntry").addEventListener("click", function () {
  const title = document.querySelector("#title").value;
  const isbn = document.querySelector("#isbn").value;
  const author = document.querySelector("#author").value;
  const date = document.querySelector("#date").value;
  if (title === "" || author === "" || isbn === "" || date === "")
    return alert("MAKE SURE ALL THE FIELDS ARE FILLED.");

  API.addBook(() => API.getAllBooks(setBooks), {
    title,
    isbn,
    author,
    date
  });
});


function displayBooks() {
  const booksContainer = document.querySelector("#books-list");
  booksContainer.innerHTML = "";
  for (let book of books)
    booksContainer.innerHTML += Card(SmallBook(book), book.isbn);

  let bookCards = document.querySelectorAll("#card");
  bookCards.forEach(bookCard => {
    const isbn = bookCard.getAttribute("isbn");
    const book = books.find(book => book.isbn === isbn);
    const showMore = bookCard.querySelector("#show-more");
    const showLess = bookCard.querySelector("#show-less");
    const deleteButton = bookCard.querySelector("#delete");
    showMore.addEventListener("click", () => {
      book.expanded = true;
      bookCard.querySelector("#book").innerHTML = DetailedBook(book);
      showLess.style["display"] = "inline-block";
      showMore.style["display"] = "none";
    });

    showLess.addEventListener("click", () => {
      book.expanded = false;
      bookCard.querySelector("#book").innerHTML = SmallBook(book);
      showLess.style["display"] = "none";
      showMore.style["display"] = "inline-block";
    });

    deleteButton.addEventListener("click", () => {
      API.deleteBook(() => API.getAllBooks(setBooks), book.isbn);
    });
  });
}