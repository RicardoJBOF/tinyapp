//adding libraries
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const cookieSession = require('cookie-session')
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))


const bcrypt = require('bcrypt');

// add EJS
app.set("view engine", "ejs");

//Start object
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ47lW" }
};



//Users object
const users = { 
  "aJ48lW": {
    id: "aJ48lW", 
    email: "ricardo@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "456DeF": {
    id: "u456DeF", 
    email: "barbosa@example.com", 
    password: "dishwasher-funk"
  }
}


//------------------------------------------------------------------------------------------

// FUNCTIONS

//Functionality to create random keys to the new urls links
function generateRandomString() {
  let randomKey = Math.random().toString(36).substring(6)
  return randomKey;
}

//Function to check if the email already exist
function checkingEmail(email, database) {
  for (const key in database) {
    if(database[key].email === email)
    return true;
  } 
  return false ;
}

// Extract a password from an object with an email as an input
function bringPassword(email, database) {
  for(const key in database) {
    if (database[key].email === email) {
      return database[key].password;
    }
  }
};

// Extract an email from an object with an id as an input
function bringEmail(id, database) {
  for(const key in database) {
    if (database[key].id === id) {
      return database[key].email;
    }
  }
};

// Extract an id from an object with an email as an input
function getUserByEmail(email, database) {
  for(const key in database) {
    if (database[key].email === email) {
      return database[key].id;
    }
  }
};

// Returns array of short URLs for logged users (from urlDatabase)
function urlsForUser(id, database) {
  let urlData = {};
  for (const key in database) {
    if (database[key].userID === id) {
      urlData[key] = { longURL: database[key].longURL , userID: database[key].userID }
      }
    };
    return urlData;
}

//----------------------------------


//ROUTERS

//To read the file index.ejs
app.get('/urls', (req, res) => {
  let user_id = req.session.user_id;
  let templateVars = { 
    "urls": urlsForUser(user_id, urlDatabase),
    email: bringEmail(user_id, users),
    user_id: req.session.user_id
    };
  res.render("urls_index", templateVars);
});




//to read the file urls_new.ejs
app.get("/urls/new", (req, res) => {
  let user_id = req.session.user_id;
  let templateVars = {
    email: bringEmail(user_id, users),
    user_id: req.session.user_id
  };
  res.render("urls_new", templateVars);
});


//to read the file login
app.get("/login", (req, res) => {
  let user_id = req.session.user_id;
  let templateVars = {
    user_id: req.session.user_id,
    email: null
  };
  res.render("login", templateVars);
});


//To read the file register.ejs
app.get("/register", (req, res) => {
  let user_id = req.session.user_id;
  let templateVars = {
    user_id: req.session.user_id,
    email: null
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

  } else if (checkingEmail(email, users)) {
    res.statusCode = 400;
    res.send("Email already registered!");

  } else {
  const hashedPassword = bcrypt.hashSync(password, 10);
  users[id] = {
    id,
    email,
    password: hashedPassword
  };
  req.session.user_id = id;
  res.redirect(`/urls`);
  }
});


// To add an edit request (change the address of an already website and keep the previous key)
app.post("/urls/:shortURL", (req, res) => {
  let user_id = req.session.user_id;
  if (user_id) {
    urlDatabase[req.params.shortURL] = {
      longURL: req.body.longURL,
      userID: user_id  
    }
  res.redirect(`http://localhost:8080/urls`)} else {
    process.exit; 
  }
});


// add login functionality
app.post("/login", (req, res) => { 
  const storedPassword = bringPassword(req.body.email, users);
  const passedPassword = req.body.password ;

  if(checkingEmail(req.body.email, users) && bcrypt.compareSync(passedPassword, storedPassword)
  ) {
  let user_id = getUserByEmail(req.body.email, users);  
  req.session.user_id = user_id;
  res.redirect(`http://localhost:8080/urls`)

  } else if (!checkingEmail(req.body.email, users)) {
    res.statusCode = 403;
    res.send("Please, enter a valid email");
  } else if (bringPassword(req.body.email, users) !== req.body.password) {
    res.statusCode = 403;
    res.send("Password does not match");
  }

});

// add logout functionality (cleaning cookies)
app.post("/logout", (req, res) => { 
  req.session = null;
  res.redirect(`http://localhost:8080/urls`)
});



//create a new Url
app.post("/urls", (req, res) => {
  let user_id = req.session.user_id;
  if (user_id) {
  let newKey = generateRandomString();
  urlDatabase[newKey] = {
    longURL: req.body.longURL,
    userID: user_id
  }  
  res.redirect(`http://localhost:8080/urls/${newKey}`);
  } else {
    res.redirect(`http://localhost:8080/urls`)
  }

});

//send you back to the urls_index after delete a Url link
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const site= urlDatabase[shortURL].longURL
  res.redirect(site);
});



//add delete request
app.post("/urls/:shortURL/delete", (req, res) => {
  let user_id = req.session.user_id;
  if (user_id) {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`http://localhost:8080/urls`);
  } else {
    process.exit;
  }
});

//ro read the file urls_show.ejs
app.get("/urls/:shortURL", (req, res) => {
  let user_id = req.session.user_id;
  let templateVars = { 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user_id: req.session.user_id,
    email: bringEmail(user_id, users)
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