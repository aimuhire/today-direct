const cheerio = require('cheerio')
const fs = require("fs")




class Scrapper {

    loadPage(url) {
        return new Promise((resolve, reject) => {

            let body = fs.readFileSync('/home/mars/Documents/github/today/temp.html')
            this.$ = cheerio.load(body.toString())
            if (!this.$)
                reject("Could not load")
            resolve(true)
        })
    }

    getSeasonsElementsList() {
        let seasonsElementsLinks = []
        this.$('.uk-accordion-content').each((index, seasonElement) => {
            seasonsElementsLinks.push(seasonElement)
        })

        return seasonsElementsLinks
    }
    getMoviesElementsList() {
        let seasonElements = this.getSeasonsElementsList()
        let seasonsList = []

        seasonElements.forEach((element, j) => {
            let seasonMovieElements = []
            this.$('.uk-margin .row2.footer', element).each((index, movieElement) => {
                seasonMovieElements.push(movieElement)
            })
            seasonsList.push(seasonMovieElements)
        });
        return seasonsList
    }

    getMovieDetails() {
        let name = this.$(".uk-article-title.uk-badge1").text()
        let seriesImage = this.$(".imageseries1 img").attr("src")


        return {
            name: this.cleanString(name),
            seriesImage: this.cleanString(seriesImage)
        }

        //tricky extraction
        //name
        //ratings
        //description
        //genre
        //language
        //resolution
        //file size
        //imdb-rating
        //imdb-vote-count
        //series-image
    }

    extractMetadataFromMovieElement(movieElement) {
        let metadata = {}
        let title = this.$(".cell2", movieElement).text()
        let size = this.$(".cell3", movieElement).text()
        let downloadText = this.$(".cell4", movieElement).text()
        let url = this.$(".cell4 a", movieElement).attr("href")


        return {
            title: this.cleanString(title),
            size: this.cleanString(size),
            downloadText: this.cleanString(downloadText),
            url: this.cleanString(url),
        }

    }

    cleanString(text) {
        // Remove new lines and repeated spaces. 
        if (text)
            return text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
        return ''

    }
}

module.exports = Scrapper
