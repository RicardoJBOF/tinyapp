# TinyApp Project
TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product
!["login-page"](https://github.com/RicardoJBOF/tinyapp/blob/master/docs/login-page.png)

!["urls-news-page"](https://github.com/RicardoJBOF/tinyapp/blob/master/docs/urls-news-page.png)

!["urls-page"](https://github.com/RicardoJBOF/tinyapp/blob/master/docs/urls-page.png)

## Dependencies
- Node.js
- Express
- EJS
- bcrypt
- body-parser
- request
- cookie-session

## Getting Started
- Install all dependencies (using the `npm install` command)
- Run the development web server using the `node express_server.js` command

## Functional Requirements

### User Stories
- As an avid twitter poster, I want to be able to shorten links so that I can fit more non-link text in my tweets

- As a twitter reader, I want to be able to visit sites via shortened links, so that I can read interesting content

### Display Requirements
- if a user is logged in, the header shows the user's email and a logout button

- if a user is not logged in, the header shows a link to the login page and a link to the registration page

### Behaviour Requirements

#### GET
- /
  - if user is logged in: redirect to /urls
  - if user is not logged: redirect to /login

- /urls
  - if user is logged in: returns HTML with the site header, a list (or table) of URLs the user has created, a link to "Create a New Short Link"
  - if user is not logged in: returns HTML with a relevant error message

- /urls/new
  - if user is logged in: returns HTML with the site header, a form which contains (text input field for the original (long) URL plus a submit button)
  if user is not logged in: redirects to the /login page

- /urls/:id
  - if user is logged in and owns the URL for the given ID, returns HTML with: the site header, the short URL (for the given ID), and form (the corresponding long URL plus an update button)
  - if a URL for the given ID does not exist, returns HTML with a relevant error message
  - if user is not logged in, returns HTML with a relevant error message
  - if user is logged it but does not own the URL with the given ID, returns HTML with a relevant error message

- /u/:id
  - if URL for the given ID exists, redirects to the corresponding long URL
  - if URL for the given ID does not exist, returns HTML with a relevant error message

- /login
  -if user is logged in, redirects to /urls
  -if user is not logged in returns HTML with a form ( input fields for email and password plus submit butto that makes a POST request to /login)

- /register
  - if user is logged in, redirects to /urls
  - if user is not logged in, returns HTML with a form (input fields for email and password plus a register button that makes a POST request to /register)

#### POST

- /urls
  - if user is logged in, generates a short URL, saves it, and associates it with the user. Then, redirects to /urls/:id, where :id matches the ID of the newly saved URL
  - if user is not logged in:returns HTML with a relevant error message

- /urls/:id
  - if user is logged in and owns the URL for the given ID, updates the URL and redirects to /urls
  - if user is not logged in, returns HTML with a relevant error message
  - if user is logged it but does not own the URL for the given ID, returns HTML with a relevant error message

- /urls/:id/delete
  - if user is logged in and owns the URL for the given ID, deletes the URL and redirects to /urls
  - if user is not logged in returns HTML with a relevant error message
  - if user is logged it but does not own the URL for the given ID returns HTML with a relevant error message

- /login
  - if email and password params match an existing user, sets a cookie and redirects to /urls
  - if email and password params don't match an existing user, returns HTML with a relevant error message 

- /register
  - if email or password are empty, returns HTML with a relevant error message
  - if email already exists, returns HTML with a relevant error message
  - If email do not exist, creates a new user encrypts the new user's password with bcrypt, sets a cookie and redirects to /urls

- /logout
  - Deletes cookie and redirects to /urls
