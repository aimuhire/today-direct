
let Scrapper = require('../scrapper')

module.exports = class ScrapperClient {
    static getSeriesMetadata() {
        return new Promise((resolve, reject) => {
            let scrapper = new Scrapper()
            scrapper.loadPage().then(() => {

            let details = scrapper.getMovieDetails()
                let extractedSeasons = []
                let seasons = scrapper.getMoviesElementsList()

                seasons.forEach(season => {
                    let extractedMovies = []

                    season.forEach(movie => {
                        let metadata = scrapper.extractMetadataFromMovieElement(movie)
                        extractedMovies.push(metadata)

                    })
                    extractedSeasons.push(extractedMovies)
                })
                resolve({ seasons: extractedSeasons, details })

            }).catch((err) => {
                reject(err)


            })
        })


    }

}
