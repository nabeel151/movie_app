
// async function getMovieList() {
//   const url = "https://movies-api.accel.li/api/v2/list_movies.json";
//   try {
//     const response = await fetch(url);
//     const resJson = await response.json();

//     // console.log("Movie API Response:", resJson.data.movies[0].imdb_code);
//     // console.log("Movie API Response:", resJson.data.movies[0].title_long);

//     return resJson.data

//   } catch (error) {
//     console.log("Error:", error);
//   }
// }
// async function displayMovie() {

//   const moviesData = await getMovieList();

//   const container = document.getElementById("movies");
//   const title = moviesData.movies[0].title_long;
//   console.log(title);

//   container.innerText = title;
// }

// displayMovie();


async function getMovieList(
  query_term = "",
  quality = "",
  genre = "",
  rating = "",
  year = "",

) {
  const url = `https://movies-api.accel.li/api/v2/list_movies.json?` +
    `query_term=${query_term}` +
    `&quality=${quality}` +
    `&genre=${genre}` +
    `&minimum_rating=${rating}` +
    `&year=${year}`;

  try {
    const response = await fetch(url);
    const resJson = await response.json();

    let movies = resJson.data.movies || [];
    
    if (year) {

      if (year.includes("-")) {

        const [minYear, maxYear] = year.split("-").map(Number);

        movies = movies.filter(movie =>
          movie.year >= minYear && movie.year <= maxYear
        );

      } else {

        movies = movies.filter(movie =>
          movie.year == year
        );

      }
    }
    // console.log(movies);


    displayMovie(movies); // 👈 call display here

  } catch (error) {
    console.log("Error:", error);
  }
}

function displayMovie(movies) {
  const container = document.getElementById("movies");

  container.innerHTML = "";

  movies.forEach(movie => {
    container.innerHTML += `
      <div class="flex flex-col group cursor-pointer">

        <div class="relative aspect-[2/3] w-full border-2 border-transparent overflow-hidden rounded-lg 
                    transition-all duration-300 group-hover:scale-105 group-hover:border-blue-600 group-hover:shadow-lg group-hover:shadow-green-500/30"">

          <img 
            src="${movie.medium_cover_image}" 
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          >
          <div class="absolute inset-0 bg-black/70 opacity-0 
                      flex flex-col justify-center items-center gap-2
                      transition duration-300 group-hover:opacity-100">

            <!-- Rating -->
            <div class="flex flex-col items-center  text-white-400 font-bold text-lg">
              <span class="text-xl color-green-600"><i class="fa-solid fa-star text-blue-600"></i></span>
               ${movie.rating}/10
            </div>

            <!-- Genres -->
            <div class="flex flex-wrap justify-center gap-1 px-2">
              ${movie.genres
        ? movie.genres.map(g => `
                  <span class="text-xs px-2 py-1 border border-blue-600 text-blue-600 rounded-full">
                    ${g}
                  </span>
                `).join('')
        : ''}
            </div>

            <!-- Button -->
            <button class="mt-2 px-3 py-1 text-sm rounded-full border border-blue-600 text-white-400 
                           transition hover:bg-blue-600 hover:text-black">
              View Details
            </button>

          </div>

        </div>

      

        <div class="mt-2">
          <h3 class="text-white text-sm font-bold truncate">
            ${movie.title_long}
          </h3>
          <p class="text-gray-400 text-xs">
            ${movie.year}
          </p>
        </div>

      </div>
    `;
  });
}


// Only call this
// getMovieList();




document.getElementById("searchBtn").addEventListener("click", function () {

  const searchValue = document.getElementById("searchInput").value.toLowerCase();

  const qualityValue = document.getElementById("qualityFilter").value;

  const genreValue = document.getElementById("genreFilter").value;

  const ratingValue = document.getElementById("ratingFilter").value;

  const yearValue = document.getElementById("yearFilter").value;

  
 


  getMovieList(
    searchValue,
    qualityValue,
    genreValue,
    ratingValue,
    yearValue
  );

});

// filter change listener 

const filters = document.querySelectorAll("select");

filters.forEach(filter => {

  filter.addEventListener("change", function () {

    const searchValue = document.getElementById("searchInput").value;

    const qualityValue = document.getElementById("qualityFilter").value;

    const genreValue = document.getElementById("genreFilter").value;

    const ratingValue = document.getElementById("ratingFilter").value;

    const yearValue = document.getElementById("yearFilter").value;

   



    getMovieList(
      searchValue,
      qualityValue,
      genreValue,
      ratingValue,
      yearValue,
  

    );

  });

});

getMovieList();