let express = require('express')
let scrapperClient = require('../scrapper-client')
let router = express.Router()

// define the home page route
router.get('/series/data/:pathname', async function (req, res) {
    let seriesMetadata = await scrapperClient.getSeriesMetadata()
    res.send(seriesMetadata)
})


module.exports = router