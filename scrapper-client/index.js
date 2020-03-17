
let Scrapper = require('../scrapper')

module.exports = class ScrapperClient {
    static getSeriesMetadata(endpoint) {
        return new Promise((resolve, reject) => {
            let scrapper = new Scrapper(endpoint)
            scrapper.loadPage().then(() => {

                let details = scrapper.getEpisodeDetails()
                let extractedSeasons = []
                let seasons = scrapper.getEpisodesElementsList()
                seasons.forEach((season, index) => {
                    let extractedEpisodes = []

                    season.seasonEpisodeElements.forEach(episode => {
                        let metadata = scrapper.extractMetadataFromEpisodeElement(episode)
                        extractedEpisodes.push(metadata)

                    })
                    extractedSeasons.push({ extractedEpisodes, title: seasons[index].title })
                })
                resolve({ seasons: extractedSeasons, details })

            }).catch((err) => {
                reject(err)
            })
        })


    }

}
