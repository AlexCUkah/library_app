let bookDisplay = document.querySelector('.center-content');
let storedBooks = [];

// Constructor for Book object
function Book(name, author, pages) {
    this.name = name;
    this.author = author;
    this.pages = pages;
}

// Function for validating input strings
function stringValidation(string) {
    let rule = /^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$/;
    return rule.test(string);
}

// Function to handle adding a new book
function uiBook() {
    let name = document.getElementById("bookName").value;
    let author = document.getElementById("authorName").value;
    let pages = document.getElementById("Pages").value;

    if (stringValidation(name) && stringValidation(author) && !isNaN(pages)) {
        const book = new Book(name, author, pages);

        // Add book to the server
        fetch('/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(book)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Book added to server:', data);
                book.id = data.data.id;
                storedBooks.push(book);

                // Display the new book on the UI
                displayBook(book);
            })
            .catch(error => console.error('Error adding book:', error));
    } else {
        alert("Please enter valid information");
    }
}


function deleteBookFromServer(bookId, bookElement) {
    fetch(`/books/${bookId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete book');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            bookElement.remove(); // Remove the book element from the UI
        })
        .catch(error => console.error('Error deleting book:', error));
}

// Function to display a single book on the UI
function displayBook(book) {
    const newDiv = document.createElement("div");
    newDiv.className = "card";

    let nameB = document.createElement('div');
    nameB.textContent = `Name: ${book.name}`;
    let authorB = document.createElement('div');
    authorB.textContent = `Author: ${book.author}`;
    let pageB = document.createElement('div');
    pageB.textContent = `Pages: ${book.pages}`;
    let deleteBook = document.createElement("button");
    deleteBook.className = "delete";
    deleteBook.textContent = "Delete Book"

    deleteBook.addEventListener('click', () => {
        deleteBookFromServer(book.id, newDiv)
    });

    bookDisplay.appendChild(newDiv);
    newDiv.appendChild(nameB);
    newDiv.appendChild(authorB);
    newDiv.appendChild(pageB);
    newDiv.appendChild(deleteBook);
}

// Function to fetch and display books from the server
function dataFromServer() {
    console.log("dataFromServer() called");
    fetch('/books')
        .then(response => {
            console.log('Server response status:', response.status); // Debugging
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched data from server:', data); // Debug fetched data
            const books = data.data;

            if (!Array.isArray(books)) {
                console.error('Books data is not an array:', books);
                return;
            }

            // Clear the previous list of books before displaying
            bookDisplay.innerHTML = '';

            // Append each book to the UI
            books.forEach(book => {
                displayBook(book);
            });
        })
        .catch(error => console.error('Error fetching books:', error));
}

// Automatically fetch and display books when the page loads
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event triggered");
    dataFromServer();

    // Now, fetch the button element and add the event listener
    let button = document.getElementById("add");

    button.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent the page from refreshing
        uiBook();
    });

    console.log("JavaScript is working");
});
