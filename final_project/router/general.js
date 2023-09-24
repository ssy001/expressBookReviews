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
            return res.status(200).json({message: "User successfully registered. Now you can login"});
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
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 3));
});

// ASYNC/PROMISE Get the book list available in the shop
public_users.get('/async', function (req, res) {
    const getAllBooks = new Promise((resolve, reject) => {
        resolve(res.status(200).send(JSON.stringify(books, null, 3)));
    });
    getAllBooks.then(() => console.log(`Promise for task 10 is resolved`));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    // const filtered_details = Object.entries(books).filter(([k,v]) => v["isbn"] == isbn);
    // if (filtered_details.length > 0) {
    //     const book_details = filtered_details.map(([k,v]) => v);
    //     return res.status(200).send(JSON.stringify(book_details, null, 3));
    // }
    if (isbn in books) {
        return res.status(200).send(JSON.stringify(books[isbn], null, 3));
    }
    return res.status(404).send(`ISBN ${isbn} not found`);
});

// ASYNC/PROMISE Get book details based on ISBN
public_users.get('/async/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getByIsbn = new Promise((resolve, reject) => {
        // const filtered_details = Object.entries(books).filter(([k,v]) => v["isbn"] == isbn);
        // if (filtered_details.length > 0) {
        //     const book_details = filtered_details.map(([k,v]) => v);
        //     resolve(res.status(200).send(JSON.stringify(book_details, null, 3)));
        // }
        if (isbn in books) {
            resolve(res.status(200).send(JSON.stringify(books[isbn], null, 3)));
        }
        else {
            reject(res.status(404).send(`ISBN ${isbn} not found`));
        }
    });
    getByIsbn
        .then(() => console.log(`Promise for task 11 is resolved`))
        .catch(() => console.log(`ISBN ${isbn} not found`));
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const filtered_details = Object.entries(books).filter(([k,v]) => v["author"] == author);
    if (filtered_details.length > 0) {
        const book_details = filtered_details.map(([k,v]) => v);
        return res.status(200).send(JSON.stringify(book_details, null, 3));
    }
    return res.status(404).send(`Author ${author} not found`);
});

// ASYNC/PROMISE Get book details based on author
public_users.get('/async/author/:author',function (req, res) {
    const author = req.params.author;
    const getByAuthor = new Promise((resolve, reject) => {
        const filtered_details = Object.entries(books).filter(([k,v]) => v["author"] == author);
        if (filtered_details.length > 0) {
            const book_details = filtered_details.map(([k,v]) => v);
            resolve(res.status(200).send(JSON.stringify(book_details, null, 3)));
        }
        else {
            reject(res.status(404).send(`Author ${author} not found`));
        }
    });
    getByAuthor
        .then(() => console.log(`Promise for task 12 is resolved`))
        .catch(() => console.log(`Author ${author} not found`));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const filtered_details = Object.entries(books).filter(([k,v]) => v["title"] == title);
    if (filtered_details.length > 0) {
        const book_details = filtered_details.map(([k,v]) => v);
        return res.status(200).send(JSON.stringify(book_details, null, 3));
    }
    return res.status(404).send(`Title ${title} not found`);
});

// ASYNC/PROMISE Get all books based on title
public_users.get('/async/title/:title',function (req, res) {
    const title = req.params.title;
    const getByTitle = new Promise((resolve, reject) => {
        const filtered_details = Object.entries(books).filter(([k,v]) => v["title"] == title);
        if (filtered_details.length > 0) {
            const book_details = filtered_details.map(([k,v]) => v);
            resolve(res.status(200).send(JSON.stringify(book_details, null, 3)));
        }
        else {
            reject(res.status(404).send(`Title ${title} not found`));
        }
    });
    getByTitle
        .then(() => console.log(`Promise for task 13 is resolved`))
        .catch(() => console.log(`Title ${title} not found`));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    // const filtered_details = Object.entries(books).filter(([k,v]) => v["isbn"] == isbn);
    // if (filtered_details.length > 0) {
    //     const book_details = filtered_details.map(([k,v]) => v);
    //     return res.status(200).send(JSON.stringify({"reviews": book_details[0]["reviews"]}, null, 3));
    // }
    if (isbn in books) {
        return res.status(200).send(JSON.stringify(books[isbn], null, 3));
    }
    return res.status(404).send(`ISBN ${isbn} not found`);
});

module.exports.general = public_users;
