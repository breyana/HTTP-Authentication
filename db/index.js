const pgp = require('pg-promise')();

const db = pgp({
  database: 'httpauth'
});

const addUser = (email, password) => {
   return db.one('INSERT INTO users(email, password) VALUES($1, $2) RETURNING email', [email, password])
    .then(data => {
      return data.email;
    })
    .catch(error => {
      console.log('ERROR:', error);
    })
}

module.exports = {
  addUser
}
