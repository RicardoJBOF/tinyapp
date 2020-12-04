//USING EXPRESS
const express = require("express");
const app = express();
const PORT = 8080;

// USING EJS
app.set("view engine", "ejs");

//USING BODYPARSER
const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//USING FOR LOGIN
const cookieSession = require("cookie-session");
app.use(
  cookieSession({
    name: "session",
    keys: ["JNT&vY@io!QDHtcEXreR?Hx@gz", "ZFJxcn&JsYU5ZcmZEVk1JMl*U4WDVYZz09"],
  })
);

//USING FOR CRYPTOGRAPHING
const bcrypt = require("bcrypt");

//USING FOR REQUEST
const request = require('request');

// IMPORT HELPERS FUNCTIONS
const {
  generateRandomString,
  checkingEmail,
  bringEmail,
  getUserByEmail,
  urlsForUser,
} = require("./helpers");

// IMPORT DB OBJECTS
const {
  urlDatabase,
  users
} = require("./db/database.js");

//GET ROUTERS
app.get("/", (req, res) => {
  const user_id = req.session.user_id;
  if (user_id) {
    return res.redirect('urls');
  } else {
    res.redirect("login");
  }
});

app.get("/urls", (req, res) => {
  const user_id = req.session.user_id;
  const templateVars = {
    urls: urlsForUser(user_id, urlDatabase),
    email: bringEmail(user_id, users),
    user_id: req.session.user_id,
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user_id = req.session.user_id;
  if (user_id) {
    const templateVars = {
      email: bringEmail(user_id, users),
      user_id: req.session.user_id,
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const user_id = req.session.user_id;;
  const urls = urlsForUser(user_id, urlDatabase);
  const longURL = urlDatabase[req.params.shortURL] ? urlDatabase[req.params.shortURL].longURL : "";
  let error;
  request(longURL, (e, response, body) => {
    if (e) {
      error = e;
    }
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL,
      user_id,
      urls,
      email: bringEmail(user_id, users),
      error
    };
    res.render("urls_show", templateVars);
  })
});

app.get("/login", (req, res) => {
  const templateVars = {
    user_id: req.session.user_id,
    email: null,
  };
  res.render("login", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = {
    user_id: req.session.user_id,
    email: null,
  };
  res.render("register", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const site = urlDatabase[shortURL].longURL;
  res.redirect(site);
});

//POST ROUTERS
app.post("/register", (req, res) => {
  const id = generateRandomString();
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.statusCode = 400;
    res.send("Please, enter valid email and/or password!");
  } else if (checkingEmail(email, users)) {
    res.statusCode = 400;
    res.send("Email already registered!");
  } else {
    const hashedPassword = bcrypt.hashSync(password, 10);
    users[id] = {
      id,
      email,
      password: hashedPassword,
    };
    req.session.user_id = id;
    res.redirect(`/urls`);
  }
});

app.post("/urls/:shortURL", (req, res) => {
  const user_id = req.session.user_id;
  if (user_id) {
    urlDatabase[req.params.shortURL] = {
      longURL: req.body.longURL,
      userID: user_id,
    };
    res.redirect(`/urls`);
  } else {
    process.exit;
  }
});

app.post("/login", (req, res) => {
  const storedPassword = users[getUserByEmail(req.body.email, users)].password;
  const passedPassword = req.body.password;
  if (
    checkingEmail(req.body.email, users) &&
    bcrypt.compareSync(passedPassword, storedPassword)
  ) {
    let user_id = getUserByEmail(req.body.email, users);
    req.session.user_id = user_id;
    res.redirect(`/urls`);
  } else if (!checkingEmail(req.body.email, users)) {
    res.statusCode = 403;
    res.send("Please, enter a valid email");
  } else {
    res.statusCode = 403;
    res.send("Password does not match");
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect(`/urls`);
});

app.post("/urls", (req, res) => {
  const user_id = req.session.user_id;
  if (user_id) {
    let newKey = generateRandomString();
    urlDatabase[newKey] = {
      longURL: req.body.longURL,
      userID: user_id,
    };
    res.redirect(`/urls/${newKey}`);
  } else {
    res.redirect(`/urls`);
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const user_id = req.session.user_id;
  if (user_id) {
    delete urlDatabase[req.params.shortURL];
    res.redirect(`/urls`);
  } else {
    process.exit;
  }
});

//SERVER LISTENING MESSAGE
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//TESTING CODE
// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

// app.get("/set", (req, res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
// });

// app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
// });
