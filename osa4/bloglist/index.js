const mongoose = require('mongoose')
const app = require('./app')
const config = require('./utils/config')

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.error(err))

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
