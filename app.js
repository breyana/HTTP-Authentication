const express = require('express');
const bodyParser = require('body-parser')

const db = require('./db')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'pug')

app.get('/', (request, response) => {
  response.render('index')
})

app.get('/signup', (request, response) => {
  response.render('signup')
})

app.post('/signup', (request, response) => {
  const email = request.body.email
  const password = request.body.password
  const passwordConfirm = request.body['password-confirmation']
  let error = undefined

  if (!password || !email) {
    error = 'Please provide an email and password to sign up'
  } else if (password !== passwordConfirm) {
    error = 'Passwords do not match'
  }
  
  if (error) {
    response.render('signup', { error })
  } else {
    const user = db.addUser(email, password)
    response.render('index', { user })
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
