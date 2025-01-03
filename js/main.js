// console.log("connected");

// *****************************************************************************
//  Movie Data in JSON Format
// *****************************************************************************
const apiKey = 'f9058d85f887c7ea80e59a844f01703c'
const movieData = []
const movieGenres = []

getMovies('https://api.themoviedb.org/3/trending/movie/week?api_key=' + apiKey)
getGenres(
  'https://api.themoviedb.org/3/genre/movie/list?api_key=' +
    apiKey +
    '&language=en-US'
)
async function getGenres(url) {
  //
  const res = await fetch(url)
  const data = await res.json()
  const genres = data.genres
  console.log(genres)
  movieGenres.push(...genres)
  displayGenres()
}
function displayGenres() {
  for (let i = 0; i < movieGenres.length; i++) {
    //
    console.log(movieGenres[i])
    document.getElementById(
      'movieGenres'
    ).innerHTML += `<input type="checkbox" onclick="filterMovies()" class="movieGenres" id="movieGenre${
      i + 1
    }" value="${movieGenres[i].id}"> <label for="movieGenre${i + 1}">${
      movieGenres[i].name
    }</label>`
  }
}
function filterMovies() {
  const allGenres = document.querySelectorAll('.movieGenres')
  const selectGenreIds = []
  for (let i = 0; i < allGenres.length; i++) {
    if (allGenres[i].checked) {
      selectGenreIds.push(Number(allGenres[i].value))
    }
  }
  if (selectGenreIds.length > 0) {
    for (let i = 1; i < movieTable.rows.length; ) {
      movieTable.deleteRow(i)
    }
    let currentPosition = 0
    for (let i = 0; i < movieData.length; i++) {
      if (movieData[i].genre_ids.some((r) => selectGenreIds.indexOf(r) >= 0)) {
        // Setup the Table Row
        const movieRow = movieTable.insertRow(currentPosition + 1)

        // New Cells
        const cell1 = movieRow.insertCell(0)
        const cell2 = movieRow.insertCell(1)
        const cell3 = movieRow.insertCell(2)
        const cell4 = movieRow.insertCell(3)

        // Populate the Cells
        cell1.innerHTML = movieData[i].title
        cell2.innerHTML = movieData[i].release_date
        cell3.innerHTML = movieData[i].vote_average
        cell4.innerHTML = `<input type="checkbox" onclick="getDetails()" class="movieItems" id="movie${
          i + 1
        }" value="${i}"> <i class="fa fa-trash-o movieItemsDelete" id="moviedelete${
          i + 1
        }" onclick="deleteItem(moviedelete${i + 1})"></i>`
        currentPosition += 1
      }
    }
  } else {
    showAllMovies()
  }
}
//fetch movies from the api
async function getMovies(url) {
  const res = await fetch(url)
  const data = await res.json()
  const movies = data.results
  console.log(movies)
  movieData.push(...movies)
  showAllMovies()
}
//show all the movies currently in the list
function showAllMovies() {
  //
  for (let i = 1; i < movieTable.rows.length; ) {
    movieTable.deleteRow(i)
  }
  // Populate the Movie Table
  for (let i = 0; i < movieData.length; i++) {
    displayMovie(i)
  }
}
// this function displays the movie at position passed to the table
function displayMovie(i) {
  // Setup the Table Row
  const movieRow = movieTable.insertRow(i + 1)

  // New Cells
  const cell1 = movieRow.insertCell(0)
  const cell2 = movieRow.insertCell(1)
  const cell3 = movieRow.insertCell(2)
  const cell4 = movieRow.insertCell(3)

  // Populate the Cells
  cell1.innerHTML = movieData[i].title
  cell2.innerHTML = movieData[i].release_date
  cell3.innerHTML = movieData[i].vote_average
  cell4.innerHTML = `<input type="checkbox" onclick="getDetails()" class="movieItems" id="movie${
    i + 1
  }" value="${i}"> <i class="fa fa-trash-o movieItemsDelete" id="moviedelete${
    i + 1
  }" onclick="deleteItem(moviedelete${i + 1})"></i>`
}

// Path to the Movie Poster
const imgPath = 'https://image.tmdb.org/t/p/w200'

// *****************************************************************************
// *****************************************************************************

// console.log(movieData);

// Processing the checkbox check event
function getDetails() {
  movieDetails.innerHTML = ''
  const allMovies = document.querySelectorAll('.movieItems')
  // console.log(allMovies);
  for (let i = 0; i < allMovies.length; i++) {
    if (allMovies[i].checked) {
      showMovieDetails(movieData[allMovies[i].value])
    }
  }
}
function showMovieDetails(theMovie) {
  // Setup the Information Section
  const newDiv = document.createElement('div')
  newDiv.className = 'movieBlock'

  // Add the Heading
  const divHeader = document.createElement('h2')
  const divHeaderText = document.createTextNode(`${theMovie.title}`)
  divHeader.appendChild(divHeaderText)
  newDiv.appendChild(divHeader)

  // Add Description Container
  const descriptionContainer = document.createElement('div')
  descriptionContainer.className = 'descriptionContainer'

  // Add the Image to the Description Container
  const movieImage = document.createElement('img')
  const imagePath = `${imgPath + theMovie.poster_path}`
  const imageAlt = `${theMovie.title}`
  movieImage.setAttribute('src', imagePath)
  movieImage.setAttribute('alt', imageAlt)

  // Create a Text Container to add to the Description Container
  const movieText = document.createElement('div')
  movieText.className = 'textDescription'

  // Add the Movie Description to the Text Container
  const movieDescription = document.createElement('div')
  const description = document.createTextNode(`${theMovie.overview}`)
  movieDescription.appendChild(description)
  movieText.appendChild(movieDescription)

  // Add the Rating to the Text Container
  const movieRating = document.createElement('div')
  const rating = document.createTextNode(
    `Rated ${theMovie.vote_average} averaged over ${theMovie.vote_count} voters`
  )
  movieRating.appendChild(rating)
  movieText.appendChild(movieRating)

  // Put it all together
  descriptionContainer.appendChild(movieImage)
  descriptionContainer.appendChild(movieText)
  newDiv.appendChild(descriptionContainer)
  movieDetails.appendChild(newDiv)
}
//this functions deletes a movie from the list
function deleteItem(itemId) {
  let result = confirm('Want to delete?')
  if (result) {
    const allMoviesDeletes = document.querySelectorAll('.movieItemsDelete')
    let movieIndex = Array.prototype.indexOf.call(allMoviesDeletes, itemId)
    if (movieIndex > -1) {
      //remove the movie at the specified index
      console.log(movieData.length)
      movieData.splice(movieIndex, 1)
      console.log(movieData.length)
      //remove table row
      movieTable.deleteRow(movieIndex + 1)
    }
  }
}
//search movie
c3Movie.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    //
    let value = c3Movie.value.trim()
    if (value.length > 0) {
      // Populate the Movie Table
      searchMovie(value)
    }
  }
})
async function searchMovie(query) {
  movieDetails.innerHTML = ''
  const res = await fetch(
    'https://api.themoviedb.org/3/search/movie?query=' +
      query +
      '&api_key=' +
      apiKey
  )
  const data = await res.json()
  const movies = data.results
  //
  console.log(movies)
  movies.forEach((theMovie) => {
    console.log(theMovie)
    showMovieDetails(theMovie)
  })
}
// getDetails.addEventListener('click', () => {

// })
