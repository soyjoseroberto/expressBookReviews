const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

public_users.post("/register", (req, res) => {
  // Write your code here
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Axios GET all books
const getAllBooks = async(url) => {
  return (await axios.get('http://localhost:5000')).data;
}

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  // let allBooks = JSON.stringify(books, null, 4);
  return res.status(200).json(books);
});

// Axios GET all books
const getBookByIsbn = async(isbn) => {
  return (await axios.get('http://localhost:5000/isbn/' + isbn)).data;
}
// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  // Write your code here
  const isbn = parseInt(req.params.isbn);
  return res.status(200).json(books[isbn]);
});

// Axios GET books details based on author
const getBooksByAuthor = async(author) => {
  return (await axios.get('http://localhost:5000' + author)).data;
}

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const authorParam = req.params.author;
  let result;
  for (let key in books) {
    if (books[key].author === authorParam) {
      result = books[key];
    }
  }
  return res.status(200).json(result);
});

const getBooksByTitle = async(title) => {
  return (await axios.get('http://localhost:5000/title/' + title)).data;
}

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  let result;
  for (let key in books) {
    if (books[key].title === req.params.title) {
      result = books[key];
    }
  }
  return res.status(200).json(result);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
