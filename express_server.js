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

// Extract a password from an object with an email as an input
function bringPassword(email) {
  let bringKey = "";
  for(const key in users) {
    if (users[key].email === email) {
      bringKey = key;
      return users[key].password;
    }
  }
};

// Extract an email from an object with an id as an input
function bringEmail(id) {
  let bringKey = "";
  for(const key in users) {
    if (users[key].id === id) {
      bringKey = key;
      return users[key].email;
    }
  }
};


// Extract an id from an object with an email as an input
function bringId(email) {
  let bringKey = "";
  for(const key in users) {
    if (users[key].email === email) {
      bringKey = key;
      return users[key].id;
    }
  }
};

//To read the file index.ejs
app.get('/urls', (req, res) => {
  let user_id = req.cookies["id"];
  let templateVars = { 
    "urls": urlDatabase,
    email: bringEmail(user_id),
    user_id: req.cookies["id"]
    };
  res.render("urls_index", templateVars);
});


//to read the file urls_new.ejs
app.get("/urls/new", (req, res) => {
  let user_id = req.cookies["id"];
  let templateVars = {
    email: bringEmail(user_id),
    user_id: req.cookies["id"]
  };
  res.render("urls_new", templateVars);
});


//to read the file login
app.get("/login", (req, res) => {
  let user_id = req.cookies["id"];
  let templateVars = {
    user_id: req.cookies["id"],
    email: bringEmail(user_id)
  };
  res.render("login", templateVars);
});


//To read the file register.ejs
app.get("/register", (req, res) => {
  let user_id = req.cookies["id"];
  let templateVars = {
    user_id: req.cookies["id"],
    email: bringEmail(user_id)
  };
  res.render("register", templateVars);
});

//To add new users
app.post("/register", (req, res) => {
  let id = generateRandomString()
  const { email, password } = req.body;
  
  if (email === '' || password === '') {
    res.statusCode = 400;
    res.send("Please, enter valid email and/or password!")

  } else if (checkingEmail(email)) {
    res.statusCode = 400;
    res.send("Email already registered!");

  } else {
  users[id] = {
    id,
    email,
    password
  };
  res.cookie('id', id);
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

  if(checkingEmail(req.body.email) && bringPassword(req.body.email) === req.body.password ) {
  let id = bringId(req.body.email);  
  res.cookie('id', id)
  res.redirect(`http://localhost:8080/urls`)
  } else if (!checkingEmail(req.body.email)) {
    res.statusCode = 403;
    res.send("Please, enter a valid email");
  } else if (bringPassword(req.body.email) !== req.body.password) {
    res.statusCode = 403;
    res.send("Password does not match");
  }

});

// add logout functionality (cleaning cookies)
app.post("/logout", (req, res) => { 
  res.clearCookie('id');
  res.redirect(`http://localhost:8080/urls`)
});



//create a new Url
app.post("/urls", (req, res) => {
  let user_id = req.cookies["id"];
  if (user_id) {
  let newKey = generateRandomString();
  urlDatabase[newKey] = req.body.longURL;
  res.redirect(`http://localhost:8080/urls/${newKey}`);
  } else {
    res.redirect(`http://localhost:8080/urls`)
  }

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
  let user_id = req.cookies["id"];
  let templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    user_id: req.cookies["id"],
    email: bringEmail(user_id)
    };
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