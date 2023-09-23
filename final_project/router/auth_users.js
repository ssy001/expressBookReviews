const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// check if the user exists
const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

// check if username is valid
const isValid = (username) => {
    const res = /^[a-zA-Z0-9_\-]+$/.exec(username);
    const valid = !!res;
    // console.log(valid, res);
    if (username.length >= 8 && valid) {
        return true;
    }
    else {
        return false;
    }
}
const invalidUsernameResponse = "Username must be at least 8 characters, can only use letters, numbers, underscores, and dashes.";

const authenticatedUser = (username,password) => { 
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign(
            {data: password}, 'access', { expiresIn: 60 * 60 });  
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // console.log(req.user);
    username = req.session.authorization["username"];
    // console.log(username);
    isbn = req.params.isbn;
    // console.log(isbn);
    review = req.query.review;
    // console.log(review);

    filtered_details = Object.entries(books).filter(([k,v]) => v["isbn"] == isbn);
    // console.log(filtered_details);

    if (filtered_details.length > 0) {
        [key, book_details] = filtered_details[0];
        // console.log(key, book_details);
        books[key]["reviews"][String(username)] = review;   // update review for specific book, username
        return res.status(200).send(`Added/modified review for user ${username}`);
        // return res.status(200).send(JSON.stringify(book_details, null, 3));
    }
    return res.status(404).send(`ISBN ${isbn} not found`);
});

// delete a book review for specific user
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // console.log(req.user);
    username = req.session.authorization["username"];
    // console.log(username);
    isbn = req.params.isbn;
    // console.log(isbn);

    filtered_details = Object.entries(books).filter(([k,v]) => v["isbn"] == isbn);
    // console.log(filtered_details);

    if (filtered_details.length > 0) {
        [key, book_details] = filtered_details[0];
        // console.log(key, book_details);
        if (books[key]["reviews"].hasOwnProperty(String(username))) {
            delete books[key]["reviews"][String(username)];
            return res.status(200).send(`Deleted review for user ${username}`);
        }
        return res.status(200).send(`Review for user ${username} not found.`);
        // return res.status(200).send(JSON.stringify(book_details, null, 3));
    }
    return res.status(404).send(`ISBN ${isbn} not found`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.doesExist = doesExist;
module.exports.users = users;
module.exports.invalidUsernameResponse = invalidUsernameResponse;
