const mongoose = require('mongoose')

before(done => {
  mongoose.connect('mongodb://localhost/muber_test')
  mongoose.connection
    .once('open', () => done())
    .on('error', error => {
      console.warn('Warning:::', error)
    })
})
