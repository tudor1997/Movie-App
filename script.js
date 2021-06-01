const API_URL = 'http://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=d80b4ecb915fbad8567dabccd8809988&page="'
const IMAGE_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'http://api.themoviedb.org/3/search/movie?api_key=d80b4ecb915fbad8567dabccd8809988&query="';


const main = document.querySelector('#main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const ratingBtn = document.getElementById('rating');
const popularityBtn = document.getElementById('popularity');

const pagination = document.getElementById('pagination');

let current_page = 1;
let row = 9;




// Get Initial Movie
getMovies(API_URL + current_page);


async function getMovies(url) {
    const res = await fetch(url);
    const data = await res.json();
  
  showMovies(data.results, row, current_page);


}
function showMovies(movies, rows, page){
    main.innerHTML = '';

   
    page--;
    let start = rows * page;
    let end = start + rows;
    let paginatedItems = movies.slice(start, end);
    
    for(let i = 0; i < paginatedItems.length; i++) {
        let movie = paginatedItems[i];

        const {title, poster_path, vote_average, overview } = movie;
      
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
     
            <img src="${IMAGE_PATH + poster_path}" alt="${title}">
        <div class="movie-info">
            <h3>${title}</h3>
            <span class="${getClassByRate(vote_average)}">${vote_average}</span>
        </div>
        <div class="overview">
            <h3>Overview</h3>
            ${overview}
        </div>
   
     `
     main.appendChild(movieEl);

         // Sort by rating
     ratingBtn.addEventListener('click', () =>{
        sortMoviesByRating(movies);
    });
    }
    setThePagination(movies, row);
}

popularityBtn.addEventListener('click', () => {
    getMovies(API_URL);
});

// Pagination

function setThePagination(movies, rows) {
    pagination.innerHTML= "";

    let pageCount = Math.ceil(movies.length / rows);
    for (i = 1; i < pageCount + 1; i++) {
      let button =  PaginationButton(i, movies);
      pagination.appendChild(button);
    }
}
function PaginationButton(page, movies){
    let button = document.createElement('button');
    button.textContent = page;
    button.classList.add('paginationBtn');
    if(current_page == page) {
        button.classList.add('active');
    }
    button.addEventListener('click', function(){
        current_page = page;
        showMovies(movies, row, page);
    })
    return button;
}
function getClassByRate(vote){
    if(vote >= 8) {
        return 'green'
    }else if(vote >= 5){
        return 'orange'
    }else {
        return 'red'
    }
}
form.addEventListener('submit', (e) => {
    e.preventDefault()

    const searchTerm = search.value;
    
    if(searchTerm && searchTerm !== ''){
        getMovies(SEARCH_API + searchTerm)

        search.value = ''
    } else {
        window.location.reload();
    }
})

function sortMoviesByRating(movies) {
    movies.sort((a,b) => {
        return b.vote_average - a.vote_average;
      })
      main.innerHTML = ''

      movies.forEach((movie) => {
          const {title, poster_path, vote_average, overview } = movie;
        
          const movieEl = document.createElement('div');
          movieEl.classList.add('movie');
  
          movieEl.innerHTML = `
       
              <img src="${IMAGE_PATH + poster_path}" alt="${title}">
          <div class="movie-info">
              <h3>${title}</h3>
              <span class="${getClassByRate(vote_average)}">${vote_average}</span>
          </div>
          <div class="overview">
              <h3>Overview</h3>
              ${overview}
          </div>
     
       `
       main.appendChild(movieEl);
      })
}

