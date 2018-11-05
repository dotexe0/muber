const DriversController = require('../controllers/drivers_controller')

module.exports = app => {
  // Listening for incoming requests of GET methods
// to the route http://localhost:3050/api
  app.get('/api', DriversController.greeting)
}

