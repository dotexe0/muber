const Driver = require('../models/driver')

  module.exports = {
  greeting(req, res) {
    res.send({ hi: 'there' })
  },
  index(req, res, next) {
    const { lng, lat } = req.query
    Driver.aggregate([
      { $geoNear: {
          near: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          spherical: true, 
          maxDistance: 200000,  // in meters (200km) 
          distanceField: 'dist'
        }
      }
    ])
      .then(drivers => res.send(drivers))
      .catch(next)
  },
  create(req, res, next) {
    const driverProps = req.body
    Driver.create(driverProps)
      .then(driver => res.send(driver))
      .catch(next)
  },
  edit(req, res, next) {
    const _id = req.params.id
    const driverProps = req.body
    Driver.findByIdAndUpdate({ _id }, driverProps)
      .then(() => {
        Driver.findById({ _id })
          .then(driver => res.send(driver))
          .catch(next)
      })
  },
  delete(req, res, next) {
    const _id = req.params.id
    Driver.findByIdAndRemove({ _id })
      .then(driver => res.status(204).res(driver))
      .catch(next)
  }
}
