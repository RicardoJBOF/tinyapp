// FUNCTIONS

//Functionality to create random keys to the new urls links
function generateRandomString() {
  let randomKey = Math.random().toString(36).substring(6)
  return randomKey;
}

//Function to check if the email already exist
function checkingEmail(email, database) {
  for (const key in database) {
    if (database[key].email === email)
      return true;
  }
  return false;
}

// Extract a password from an object with an email as an input
function bringPassword(email, database) {
  for (const key in database) {
    if (database[key].email === email) {
      return database[key].password;
    }
  }
};

// Extract an email from an object with an id as an input
function bringEmail(id, database) {
  for (const key in database) {
    if (database[key].id === id) {
      return database[key].email;
    }
  }
};

// Extract an id from an object with an email as an input
function getUserByEmail(email, database) {
  for (const key in database) {
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
      urlData[key] = {
        longURL: database[key].longURL,
        userID: database[key].userID
      }
    }
  };
  return urlData;
}


module.exports = {
  generateRandomString,
  checkingEmail,
  bringPassword,
  bringEmail,
  getUserByEmail,
  urlsForUser
}