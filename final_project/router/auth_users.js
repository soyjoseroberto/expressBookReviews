const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  // returns boolean
  // write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });

  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const user = req.body.user;
    if (!user) {
        return res.status(404).json({message: "Body Empty"});
    }
    // Check if user is authenticated
    // const isAuth = authenticatedUser(user.username, user.password);
    // if (isAuth) {
      let accessToken = jwt.sign({
        data: user
      }, 'access', { expiresIn: 60 * 60 });

      console.log("Assigning authorization");
      req.session.authorization = {
        accessToken
      }
    // }
    
    return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Get the user from authenticated request
  const user = req.user.data;
  // Get book isbn
  const isbn = parseInt(req.params.isbn);
  // Get review from payload
  const review = req.query.review;
  // Compare is user already has an existing review for specific book isbn
  // if (books[isbn].reviews[user.username]) {}
  books[isbn].reviews[user.username] = review;
  // If so, override with new review from payload, it not, add it to reviews for book
  return res.status(200).json(books[isbn]);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
