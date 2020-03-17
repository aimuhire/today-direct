const cheerio = require('cheerio')
let rp = require('request-promise');



class Scrapper {
    constructor(endpoint) {
        if (endpoint.startsWith("/"))
            this.url = "http://www.todaytvseries2.com" + endpoint
    }

    loadPage() {
        return new Promise((resolve, reject) => {
            rp(this.url).then((body) => {
                this.$ = cheerio.load(body)
                if (!this.$)
                    reject("Could not load")
                resolve(true)
            })

        })
    }

    getSeasonsElementsList() {
        let seasonsElementsLinks = []
        this.$('.uk-accordion-content').each((index, seasonElement) => {
            seasonsElementsLinks.push(seasonElement)
        })

        return seasonsElementsLinks
    }
    getEpisodesElementsList() {
        let seasonElements = this.getSeasonsElementsList()
        let seasonsList = []

        // get season titles 
        let seasonTitles = []
        this.$('.uk-accordion-title').each((i, elem) => {
            seasonTitles[i] = this.cleanString(this.$(elem).text());
        });
        seasonElements.forEach((element, seasonIndex) => {
            let seasonEpisodeElements = []
            this.$('.uk-margin .row2.footer', element).each((index, episodeElement) => {
                seasonEpisodeElements.push(episodeElement)
            })
            seasonsList.push({ seasonEpisodeElements, title: seasonTitles[seasonIndex] })
        });
        return seasonsList
    }

    getEpisodeDetails() {
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

    extractMetadataFromEpisodeElement(episodeElement) {
        let metadata = {}
        let title = this.$(".cell2", episodeElement).text()
        let size = this.$(".cell3", episodeElement).text()
        let downloadText = this.$(".cell4", episodeElement).text()
        let url = this.$(".cell4 a", episodeElement).attr("href")


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
