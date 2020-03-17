class SearchController {
    constructor() {
        this.searchResultsContainer = document.getElementById("search-results-container")
        this.seriesContainer = document.getElementById("series-container")
        this.loaderContainer = document.getElementById("loader")
        this.loaderElements = document.getElementsByClassName("loader_blockG")
    }
    showLoader() {
        this.loaderContainer.style.height = "230px"
        for (let block of ['blockG_1', 'blockG_2', 'blockG_3']) {
            this.loaderElements[block].style.display = "block"
        }
    }
    hideLoader() {
        this.loaderContainer.style.height = "0"
        for (let block of ['blockG_1', 'blockG_2', 'blockG_3']) {
            this.loaderElements[block].style.display = "none"
        }
    }
    setupSearchEnterEvent() {
        document.getElementById("search").addEventListener("keyup", (event) =>{
            if (event.keyCode === 13) {
                this.showSearchResults()
            }
        })
    }
    getSearchInput() {
        let searchWord = document.getElementById("search").value
        return searchWord
    }
    async getSearchResults() {


        let searchInput = this.getSearchInput()
        if (!searchInput)
            return // should display error something 
        this.showLoader()
        let searchResults = await fetch("/search/" + encodeURIComponent(searchInput)).then(response => {
            return response.json()
        })
        this.hideLoader()
        return searchResults
    }
    async getSeriesResults(endpoint) {

        if (!endpoint)
            return // should display error something 

        let seriesResults = await fetch("/series/" + encodeURIComponent(endpoint)).then(response => {
            return response.json()
        })
        return seriesResults
    }
    createSearchResultElement(result) {
        let searchElement = document.createElement("div")
        searchElement.className = "search-item-container"
        let titleElement = document.createElement("span")
        titleElement.className = "search-item-title"
        let descriptionElement = document.createElement("span")
        descriptionElement.className = "search-item-description"
        // Populate children
        titleElement.innerText = result.title
        descriptionElement.innerText = result.text

        // Append to parent
        searchElement.append(titleElement)
        searchElement.append(descriptionElement)
        // Add click listener
        searchElement.addEventListener("click", () => {
            this.showSeriesLinks(result.url)
        })
        return searchElement
    }

    createEpisodeElement(episode) {
        let episodeElement = document.createElement("div")
        episodeElement.className = "episode-item-container"
        let titleElement = document.createElement("span")
        titleElement.className = "episode-item-title"
        let sizeElement = document.createElement("span")
        sizeElement.className = "episode-item-size"
        let dlTextElement = document.createElement("a")
        dlTextElement.className = "episode-item-dltext"
        dlTextElement.href = episode.url
        // Populate elements
        titleElement.innerText = episode.title
        sizeElement.innerText = episode.size
        dlTextElement.innerText = episode.downloadText
        // Attach to container
        episodeElement.append(titleElement)
        episodeElement.append(sizeElement)
        episodeElement.append(dlTextElement)

        return episodeElement
    }

    async showSearchResults() {
        // reset result box
        this.searchResultsContainer.innerHTML = ''
        this.seriesContainer.innerHTML = ''
        let searchResults = await this.getSearchResults()

        if (!searchResults || !searchResults.results)
            return //TODO  show error message
        searchResults.results.forEach(result => {
            let resultElement = this.createSearchResultElement(result)
            this.searchResultsContainer.append(resultElement)
        });
    }

    async showSeriesLinks(endpoint) {
        // reset result box
        if (!endpoint)
            return // display error
        this.seriesContainer.innerHTML = ''
        this.searchResultsContainer.innerHTML = ''
        this.showLoader()
        let seriesResults = await this.getSeriesResults(endpoint)
        this.hideLoader()
        // show Image and title
        let seriesTitleElement = document.createElement("h1")
        seriesTitleElement.className = "series-title"
        seriesTitleElement.innerText = seriesResults.details.name
        let seriesBG = document.createElement("img")
        seriesBG.className = "series-image"
        seriesBG.src = "http://todaytvseries2.com/" + seriesResults.details.seriesImage
        seriesBG.style.height = "200px"
        this.seriesContainer.append(seriesTitleElement)
        this.seriesContainer.append(seriesBG)
        if (!seriesResults)
            return //TODO  show error message 
        seriesResults.seasons.forEach(season => {
            let seasonElement = document.createElement("div")
            seasonElement.className = "season-container"
            let titleElement = document.createElement("h3")
            titleElement.className = "season-title"
            titleElement.innerText = season.title

            seasonElement.append(titleElement)

            season.extractedEpisodes.forEach(episode => {
                let episodeElement = this.createEpisodeElement(episode)
                seasonElement.append(episodeElement)
            })
            this.seriesContainer.append(seasonElement)
        });
    }
}


let searchCtrl = new SearchController()
searchCtrl.hideLoader()
searchCtrl.setupSearchEnterEvent()