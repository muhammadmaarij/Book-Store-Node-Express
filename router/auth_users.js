const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{
    return users.some(user => user.username === username && user.password === password);
}


regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  // Check if the user exists and the password is correct
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({message: "Invalid username or password"});
  }

  // Create a JWT token
  const token = jwt.sign({ username }, 'your-secret-key');

  // Set the token in a cookie
  res.cookie("token", token, { httpOnly: true });

  return res.status(200).json({message: "Successfully logged in"});
});


regd_users.get("/auth/review/:isbn", (req, res) => {
    console.log("In method")
    const { isbn } = req.params;
    const { review } = req.query;
    const username = req.session.username;
    console.log(username,isbn,review);
  
    // Find the book with the given ISBN
    let book;
    for (const key in books) {
      if (books.hasOwnProperty(key) && books[key].isbn === isbn) {
        book = books[key];
        break;
      }
    }
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Add or update the review
    if (book.reviews[username]) {
      book.reviews[username] = review;
    } else {
      book.reviews[username] = review;
    }
  
    return res.status(200).json({ message: "Review added" });
  });
  
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
