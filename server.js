const express = require('express')
const api = require('./api')
const app = express()

app.use(express.static('public'))

app.get('/episodes', function (req, res) {
  res.send('hello world')
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
