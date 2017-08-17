const express = require('express');
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')

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
  response.render('signup')
})

app.post('/signup', (request, response) => {
  const email = request.body.email
  const password = request.body.password
  const passwordConfirm = request.body['password-confirmation']
  let errorMessage = undefined

  if (!password || !email) {
    errorMessage = 'Please provide an email and password to sign up'
  } else if (password !== passwordConfirm) {
    errorMessage = 'Passwords do not match'
  }

  if (errorMessage) {
    response.render('signup', { error })
  } else {
    db.addUser(email, password)
      .then(user => {
        request.session.email = user
        response.redirect('/')
      })
      .catch(error => {
        if (error.code === '23505') {
          errorMessage = 'That email address is already taken'
        } else {
          errorMessage = 'There was an error'
        }
        response.render('signup', { errorMessage })
      })
  }
})

app.get('/login', (request, response) => {
  response.render('login')
})

app.get('/logout', (request, response) => {
  response.redirect('/')
})

app.listen(3000, () => {
  console.log('App is up and running on localhost:3000')
})
