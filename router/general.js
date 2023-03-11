const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  if (!isValid) {
    return res.status(409).json({ message: "User with this email already exists" });
  }
  const newUser = {
    id: users.length + 1,
    username,
    email,
    password
  };
  users.push(newUser);

  return res.status(201).json({ message: "User registered successfully", user: newUser });
});

public_users.get('/users', (req, res) => {
    res.send(users);
})

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let foundBook = null;

  for (let key in books) {
    if (books[key].isbn === isbn) {
      foundBook = books[key];
      break;
    }
  }
  if (foundBook !== null) {
    return res.status(200).json(foundBook);
  } else {
    return res.status(404).send("Book with this ISBN number not found");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', function(req, res) {
    const author = req.params.author;
    let foundBooks = [];
      for (let key in books) {
      if (books[key].author.toLowerCase().replaceAll(" ", "") === author.toLowerCase()) {
        foundBooks.push(books[key]);
      }
    }
  
    if (foundBooks.length > 0) {
      return res.status(200).json(foundBooks);
    } else {
      return res.status(404).json({ message: "Books not found for the given author" });
    }
  });
  

  public_users.get('/title/:title', function(req, res) {
    const searchTerm = req.params.title; // replace spaces with %20
    let foundBooks = [];
      for (let key in books) {
      const bookTitle = books[key].title.replaceAll(" ", "");
        console.log(bookTitle);
      if (bookTitle.toLowerCase() === searchTerm.toLowerCase()) {
        foundBooks.push(books[key]);
      }
    }
      if (foundBooks.length > 0) {
      return res.status(200).json(foundBooks);
    } else {
      return res.status(404).send("Book with this title was not found");
    }
  });
  

  public_users.get('/review/:isbn', function(req, res) {
    const isbn = req.params.isbn;
  
    const book = Object.values(books).find(book => book.isbn === isbn);
  
    if (book && book.reviews) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({ message: "Review not found for the given ISBN" });
    }
  });
  

module.exports.general = public_users;
