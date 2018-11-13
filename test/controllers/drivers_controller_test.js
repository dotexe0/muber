const assert = require('assert')
const mongoose = require('mongoose')
const request = require('supertest')

const Driver = mongoose.model('driver')
const app = require('../../app')

describe('Drivers controller', () => {
  it('POST to /api/drivers to create a new driver', done => {
    Driver.count().then(count => {
      
      request(app)
        .post('/api/drivers')
        .send({ email: 'test@test.com' })
        .end((err, res) => {
          const { body } = res
          Driver.create(body)
          Driver.count().then(newCount => {
            assert(count + 1 === newCount)
            done()
          })
      })  
    })
  })
  it('PUT to /api/drivers/:if to update a driver', done => {
    const driver = new Driver({ email: 't@t.com', driving: false })
    driver.save()
      .then(() => {
        request(app)
          .put(`/api/drivers/${driver._id}`)
          .send({ driving: true })
          .end((err, res) => {
            Driver.findOne({ email: 't@t.com' })
              .then(driver => {
                assert(driver.driving === true)
                done()
              })
          })
      })
  })

  it('DELETE to /api/drivers/:if to delete a driver', done => {
    const driver = new Driver({ email: 't@t.com', driving: false })
    driver.save()
      .then(() => {
        request(app)
        .delete(`/api/drivers/${driver._id}`)
        .end((err, res) => {
          Driver.findOne({ email: 't@t.com' })
          .then(driver => {
            assert(driver === null)
            done()
          })
        })
      })
  })
  
  it('GET to /api/drivers finds drivers in a location', done => {
    const seattleDriver = new Driver({
      email: 'seattle@test.com',
      geometry: { type: 'Point', coordinates: [-122.4759902, 47.6147628]}
    })

    const miamiDriver = new Driver({
      email: 'miami@test.com',
      geometry: { type: 'Point', coordinates: [-80.253, 25.791]}
    })
    
    Promise.all([seattleDriver.save(), miamiDriver.save()])
      .then(() => {
        request(app)
          .get('/api/drivers?lng=-80&lat=25')
          .end((err, res) => {
            assert(res.body[0].email === 'miami@test.com')
            assert(res.body.length === 1)
            done()
          })
      })
  })
})
