const express = require("express")
const router = require("./routes/api")
var path = require('path');
const app = express()

app.use(express.static('public'))

app.use('/', router)

app.listen(3000)