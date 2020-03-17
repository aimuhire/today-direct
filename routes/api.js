let express = require('express')
let rp = require('request-promise');
let scrapperClient = require('../scrapper-client')
let router = express.Router()

// define the home page route



router.get('/series/:pathname', async function (req, res) {
    let pathname = req.params.pathname 
    let seriesMetadata = await scrapperClient.getSeriesMetadata(pathname)
    res.json(seriesMetadata)
})
router.get('/search/:keyword', async function (req, res) {

    let searchAPI = "http://www.todaytvseries2.com/component/search/?tmpl=raw&type=json&ordering=&searchphrase=all&searchword="

    let keyword = req.params.keyword
    if (!keyword)
        return res.send([])
    let searchResults = await rp(searchAPI + keyword)
    res.send(searchResults)

})


module.exports = router