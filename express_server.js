//adding libraries
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const  cookieParser = require('cookie-parser')
app.use(cookieParser())

// add EJS
app.set("view engine", "ejs");

//Start object
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Users object
const users = { 
  "123AbC": {
    id: "123AbC", 
    email: "ricardo@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "456DeF": {
    id: "u456DeF", 
    email: "barbosa@example.com", 
    password: "dishwasher-funk"
  }
}

//Functionality to create random keys to the new urls links
function generateRandomString() {
  let randomKey = Math.random().toString(36).substring(6)
  return randomKey;
}

//Function to check if the email already exist
function checkingEmail(email) {
  for (const key in users) {
    if(users[key].email === email)
    return true;
  } 
  return false ;
}

//To read the file index.ejs
app.get('/urls', (req, res) => {
  let templateVars = { 
    "urls": urlDatabase,
     username: req.cookies["username"]
    };
  res.render("urls_index", templateVars);
});


//to read the file urls_new.ejs
app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
  };
  res.render("urls_new", templateVars);
});

//To read the file register.ejs
app.get("/register", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
  };
  res.render("register", templateVars);
});

//To add new users
app.post("/register", (req, res) => {
  let newUser = generateRandomString()
  const { email, password } = req.body;
  
  if (email === '' || password === '') {
    res.statusCode = 400;
    res.send("Please, enter valid email and/or password!")

  } else if (checkingEmail(email)) {
    res.statusCode = 400;
    res.send("Email already registered!");

  } else {
  users[newUser] = {
    newUser,
    email,
    password
  };
  res.cookie('username', email);
  res.redirect(`http://localhost:8080/urls`);
  }
});


// To add an edit request (change the address of an already website and keep the previous key)
app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL
  res.redirect(`http://localhost:8080/urls`)
});

// add login functionality
app.post("/login", (req, res) => { 
  res.cookie('username', req.body.username)
  res.redirect(`http://localhost:8080/urls`)
});

// add logout functionality (cleaning cookies)
app.post("/logout", (req, res) => { 
  res.clearCookie('username');
  res.redirect(`http://localhost:8080/urls`)
});

//create a new Url
app.post("/urls", (req, res) => {
  let newKey = generateRandomString();
  urlDatabase[newKey] = req.body.longURL;
  res.redirect(`http://localhost:8080/urls/${newKey}`);
});

//send you back to the urls_index after delete a Url link
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


//add delete request
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect(`http://localhost:8080/urls`);
});

//ro read the file urls_show.ejs
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

// -----------------------------------------------------------------------------
//TESTING CODE
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });
 
 app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
 });
//-------------------------------------------------------------------

//Send message that the server is working
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});