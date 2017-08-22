const pgp = require('pg-promise')();

const db = pgp({
  database: 'httpauth'
});

const addUser = (email, password) => {
   return db.one('INSERT INTO users(email, password) VALUES($1, $2) RETURNING email', [email, password])
    .then(data => {
      return data.email;
    })
}

const retrieveUser = (email) => {
  return db.one('SELECT * FROM users WHERE email = $1', [email])
}

module.exports = {
  addUser,
  retrieveUser
}
