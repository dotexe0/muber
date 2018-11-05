const app = require('./app')

app.listen(3050, () => {
  const PORT = process.env.PORT || '3050'
  console.log(`Running on port ${PORT}`)
})
