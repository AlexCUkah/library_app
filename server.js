const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const booksFilePath = 'books.json'; // Correct variable name

app.use(bodyParser.json());

// Serve the static files (your HTML, CSS, and JS)
app.use(express.static(path.join(__dirname)));

// Read books from the JSON file
function readBooksFromFile() {
    if (!fs.existsSync(booksFilePath)) {
        fs.writeFileSync(booksFilePath, '[]'); // Create file if it doesn't exist
    }
    const data = fs.readFileSync(booksFilePath, 'utf8');
    return JSON.parse(data);
}

// Write books to the JSON file
function writeBooksToFile(books) {
    fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));
}

// Route to fetch all books
app.get('/books', (req, res) => {
    const books = readBooksFromFile();
    res.json({
        message: 'success',
        data: books
    });
});

// Route to add a new book
app.post('/books', (req, res) => {
    const { name, author, pages } = req.body;

    const books = readBooksFromFile();

    const newBook = {
        id: books.length + 1,
        name,
        author,
        pages
    };

    books.push(newBook);
    writeBooksToFile(books);

    res.json({
        message: 'success',
        data: newBook
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
