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
})
