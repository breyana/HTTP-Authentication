const express = require('express');
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'pug')

app.get('/', (request, response) => {
  response.render('index')
})

app.get('/signup', (request, response) => {
  response.render('signup')
})

app.get('/login', (request, response) => {
  response.render('login')
})

app.listen(3000, () => {
  console.log('App is up and running on localhost:3000')
})
