const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let doesExist = require("./auth_users.js").doesExist;
let users = require("./auth_users.js").users;
let invalidUsernameResponse = require("./auth_users.js").invalidUsernameResponse;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
        const testValid = isValid(username);
        const testExist = doesExist(username);

        if (testValid && !testExist) { 
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } 
        else if (!testValid) {
            return res.status(404).json({message: "Username is invalid. "+invalidUsernameResponse});    
        }
        else if (testExist) {
            return res.status(404).json({message: "User already exists!"});
        }
    } 
    else if (!username) {
        return res.status(404).json({message: "Username missing"});
    }
    else if (!password) {
        return res.status(404).json({message: "Password missing"});
    }
});
  
// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 3));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    isbn = req.params.isbn;
    filtered_details = Object.entries(books).filter(([k,v]) => v["isbn"] == isbn);
    if (filtered_details.length > 0) {
        book_details = filtered_details.map(([k,v]) => v);
        return res.status(200).send(JSON.stringify(book_details, null, 3));
    }
    return res.status(404).send(`ISBN ${isbn} not found`);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    author = req.params.author;
    filtered_details = Object.entries(books).filter(([k,v]) => v["author"] == author);
    if (filtered_details.length > 0) {
        book_details = filtered_details.map(([k,v]) => v);
        return res.status(200).send(JSON.stringify(book_details, null, 3));
    }
    return res.status(404).send(`Author ${author} not found`);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    title = req.params.title;
    filtered_details = Object.entries(books).filter(([k,v]) => v["title"] == title);
    if (filtered_details.length > 0) {
        book_details = filtered_details.map(([k,v]) => v);
        return res.status(200).send(JSON.stringify(book_details, null, 3));
    }
    return res.status(404).send(`Title ${title} not found`);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    isbn = req.params.isbn;
    filtered_details = Object.entries(books).filter(([k,v]) => v["isbn"] == isbn);
    if (filtered_details.length > 0) {
        book_details = filtered_details.map(([k,v]) => v);
        return res.status(200).send(JSON.stringify({"reviews": book_details[0]["reviews"]}, null, 3));
    }
    return res.status(404).send(`ISBN ${isbn} not found`);
});

module.exports.general = public_users;
