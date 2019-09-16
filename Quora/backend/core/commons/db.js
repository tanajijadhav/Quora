let mongoose = require('mongoose');
let config = require('../configs/config')
class Database {
  constructor() {
    this._connect()
  }
  _connect() {
    console.log("CONNECTING TO ", `${config.db.endpoint}`)
    mongoose.connect(encodeURI(`${config.db.endpoint}`), {
        "user": `${config.db.username}`,
        "pass": `${config.db.password}`,
        "useNewUrlParser": true,
        "useCreateIndex": true
      })
      .then(() => {
        console.log('Database connection successful')
      })
      .catch(err => {
        console.error('Database connection error', err)
      })
  }
}
module.exports = new Database()