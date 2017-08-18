const express = require('express');
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt')

const db = require('./db')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieSession({
  name: 'session',
  secret: 'reallyLongComplicatedString'
}))

app.set('view engine', 'pug')

app.get('/', (request, response) => {
  const user = request.session.email
  response.render('index', { user })
})

app.get('/signup', (request, response) => {
  if (request.session.email) {
    response.redirect('/')
  } else {
    response.render('signup')
  }
})

app.post('/signup', (request, response) => {
  const { email, password } = request.body
  const passwordConfirm = request.body['password-confirmation']
  let errorMessage

  if (!password || !email) {
    errorMessage = 'Please provide an email and password to sign up'
  } else if (password !== passwordConfirm) {
    errorMessage = 'Passwords do not match'
  }

  if (errorMessage) {
    response.render('signup', { error })
  } else {
    bcrypt.hash(password, 10)
      .then(hash => db.addUser(email, hash))
      .then(user => {
        request.session.email = user
        response.redirect('/')
      })
      .catch(error => {
        const DUPLICATE_ENTRY = '23505'
        if (error.code === DUPLICATE_ENTRY) {
          errorMessage = 'That email address is already taken'
        } else {
          errorMessage = 'There was an error'
        }
        response.render('signup', { errorMessage })
      })
  }
})

app.get('/login', (request, response) => {
  if (request.session.email) {
    response.redirect('/')
  } else {
    response.render('login')
  }
})

app.post('/login', (request, response) => {
  const email = request.body.email
  const password = request.body.password
  let errorMessage
  db.retrieveUser(email)
    .then(user => bcrypt.compare(password, user.password))
    .then(result => {
      if (result) {
        request.session.email = email
        response.redirect('/')
      } else {
        throw new Error()
      }
    })
    .catch(error => {
      errorMessage = 'Incorrect email or password'
      response.render('login', {errorMessage})
    })
})

app.get('/logout', (request, response) => {
  request.session = null
  response.redirect('/')
})

app.listen(3000, () => {
  console.log('App is up and running on localhost:3000')
})
