let mainPage = document.querySelector('.main-content')

let storedBooks = []

function Book(name, author, pages,) {
    this.name = name
    this.author = author
    this.pages = pages


}

function addBookToStore(name, author, pages,) {
    const Book = new Book(name, author, pages)
    storedBooks.push(Book)
}

