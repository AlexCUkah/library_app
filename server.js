const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const booksFilePath = path.join(__dirname, 'books.json');  // Path to books.json
const idTrackerFilePath = path.join(__dirname, 'idTracker.json');  // Path to idTracker.json

app.use(bodyParser.json());

// Serve static files (HTML, CSS, JavaScript) directly from the root directory
app.use(express.static(__dirname));

// Function to read books from the JSON file
function readBooksFromFile() {
    if (!fs.existsSync(booksFilePath)) {
        fs.writeFileSync(booksFilePath, '[]'); // Create file if it doesn't exist
    }
    const data = fs.readFileSync(booksFilePath, 'utf8');
    return JSON.parse(data);
}

// Function to write books to the JSON file
function writeBooksToFile(books) {
    fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2), 'utf8');
}


// Function to read the current highest ID from the tracker file
function readIdTracker() {
    if (!fs.existsSync(idTrackerFilePath)) {
        fs.writeFileSync(idTrackerFilePath, '0'); // If no file exists, start with ID 0
    }
    const idData = fs.readFileSync(idTrackerFilePath, 'utf8');
    return parseInt(idData, 10);  // Ensure the returned value is an integer
}

// Function to update the highest used ID in the tracker file
function updateIdTracker(newId) {
    fs.writeFileSync(idTrackerFilePath, newId.toString(), 'utf8');
}


// Function to generate a unique ID for new books
function getNextBookId() {
    let currentHighestId = readIdTracker(); // Read the current highest ID from the idTracker.json file
    const newId = currentHighestId + 1;  // Increment the ID by 1
    updateIdTracker(newId); // Update the tracker file with the new highest ID
    return newId;
}

// Route to fetch all books
app.get('/books', (req, res) => {
    const books = readBooksFromFile();
    res.json({
        message: 'success',
        data: books
    });
});

// Route to fetch a single book by ID
app.get('/books/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const books = readBooksFromFile();
    const book = books.find(book => book.id === id);

    if (book) {
        res.json({
            message: 'success',
            data: book
        });
    } else {
        res.status(404).json({
            message: 'Book not found'
        });
    }
});

// Route to add a new book
app.post('/books', (req, res) => {
    const { name, author, pages } = req.body;

    const books = readBooksFromFile();

    const newBook = {
        id: getNextBookId(),  // Generate a unique ID for the book
        name,
        author,
        pages
    };

    books.push(newBook);  // Add the new book to the array
    writeBooksToFile(books);  // Save the updated list to the books.json file

    res.json({
        message: 'success',
        data: newBook  // Return the newly created book with its ID
    });
});

// Route to delete a book by ID
app.delete('/books/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    let books = readBooksFromFile();
    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);  // Remove the book with the matching ID
        writeBooksToFile(books);  // Write the updated list back to the JSON file
        res.json({ message: 'Book deleted successfully' });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

// Serve the index.html file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));  // Serve index.html from the root directory
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
