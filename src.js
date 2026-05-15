let filterData = {
  query_term: "",
  quality: "",
  genre: "",
  rating: "0",
  year: "",
  page: 1
};

const searchEle = document.getElementById("query_term");
const qualityEle = document.getElementById("quality");
const genreEle = document.getElementById("genre");
const ratingEle = document.getElementById("rating");
const yearEle = document.getElementById("year");

const loader = document.getElementById("loader");

// GET MOVIES FROM API

async function getMovieList(
  query_term = "",
  quality = "",
  genre = "",
  rating = "0",
  year = "",
  page = 1
) {

  const limit = 30;

  const url =
    `https://movies-api.accel.li/api/v2/list_movies.json?` +
    `query_term=${query_term}` +
    `&quality=${quality}` +
    `&genre=${genre}` +
    `&minimum_rating=${rating}` +
    `&year=${year}` +
    `&page=${page}` +
    `&limit=${limit}`;

  try {
    // show loader
    loader.classList.remove("hidden");

    const response = await fetch(url);

    const resJson = await response.json();

    const movies = resJson.data.movies || [];

    const movieCount = resJson.data.movie_count || 0;

    displayMovie(movies);

    renderPagination(movieCount, limit);

    // HIDE LOADER AFTER SUCCESS
    loader.classList.add("hidden");

  } catch (error) {

    console.log("Error:", error);

    //hide loader
    loader.classList.add("hidden");

  }
}



// DISPLAY MOVIES


function displayMovie(movies) {

  const container = document.getElementById("movies");

  container.innerHTML = "";

  if (movies.length === 0) {

    container.innerHTML = `
      <div class="col-span-full text-center text-white text-2xl py-10">
        No Movies Found
      </div>
    `;

    return;
  }

  movies.forEach(movie => {

    container.innerHTML += `
    
      <div class="flex flex-col group cursor-pointer">

        <div class="relative aspect-[2/3] w-full border-2 border-transparent overflow-hidden rounded-lg 
                    transition-all duration-300 group-hover:scale-105 group-hover:border-blue-600 group-hover:shadow-lg group-hover:shadow-blue-500/30">

          <img 
            src="${movie.medium_cover_image}" 
            alt="${movie.title}"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          >

          <div class="absolute inset-0 bg-black/70 opacity-0 
                      flex flex-col justify-center items-center gap-2
                      transition duration-300 group-hover:opacity-100">

            <!-- Rating -->
            <div class="flex flex-col items-center text-white font-bold text-lg">

              <span class="text-xl text-yellow-400">
                <i class="fa-solid fa-star"></i>
              </span>

              ${movie.rating}/10

            </div>

            <!-- Genres -->
            <div class="flex flex-wrap justify-center gap-1 px-2">

              ${movie.genres
        ? movie.genres.map(g => `
                    <span class="text-xs px-2 py-1 border border-blue-600 text-blue-400 rounded-full">
                      ${g}
                    </span>
                  `).join("")
        : ""
      }

            </div>

            <!-- Button -->
            <button class="mt-2 px-3 py-1 text-sm rounded-full border border-blue-600 text-white
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



// PAGINATION


function renderPagination(totalMovies, limit) {

  const totalPages = Math.ceil(totalMovies / limit);

  const paginationContainers = document.querySelectorAll(
    '[aria-label="Pagination"]'
  );

  if (totalPages <= 1) {

    paginationContainers.forEach(el => {
      el.innerHTML = "";
    });

    return;
  }

  let startPage = Math.max(1, filterData.page - 2);

  let endPage = Math.min(totalPages, startPage + 4);

  // Keep 5 buttons visible
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  let html = "";

  // PREV BUTTON
  if (filterData.page > 1) {

    html += `
      <button 
        onclick="changePage(${filterData.page - 1})"
        class="px-4 py-2 text-sm font-bold text-white bg-transparent border border-white/10 rounded hover:bg-blue-600">
        « Prev
      </button>
    `;
  }

  // PAGE BUTTONS
  for (let i = startPage; i <= endPage; i++) {

    const isActive = i === filterData.page;

    html += `
      <button 
        onclick="changePage(${i})"
        class="px-4 py-2 text-sm font-bold border rounded transition-colors
        ${isActive
        ? "bg-blue-600 text-white border-blue-600"
        : "text-white bg-transparent border-white/10 hover:bg-white/5"
      }">

        ${i}

      </button>
    `;
  }

  // NEXT BUTTON
  if (filterData.page < totalPages) {

    html += `
      <button 
        onclick="changePage(${filterData.page + 1})"
        class="px-4 py-2 text-sm font-bold text-white bg-transparent border border-white/10 rounded hover:bg-blue-600">
        Next »
      </button>
    `;
  }

  paginationContainers.forEach(container => {
    container.innerHTML = html;
  });
}



// CHANGE PAGE


window.changePage = function (page) {

  filterData.page = page;

  getMovieList(
    filterData.query_term,
    filterData.quality,
    filterData.genre,
    filterData.rating,
    filterData.year,
    filterData.page
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

};


// SEARCH BUTTON


document.getElementById("searchBtn").addEventListener("click", function () {

  filterData.query_term = searchEle.value;

  filterData.quality = qualityEle.value;

  filterData.genre = genreEle.value;

  filterData.rating = ratingEle.value;

  filterData.year = yearEle.value;

  filterData.page = 1;

  getMovieList(
    filterData.query_term,
    filterData.quality,
    filterData.genre,
    filterData.rating,
    filterData.year,
    filterData.page
  );

});



// FILTER CHANGE LISTENER


const filters = document.querySelectorAll(".changeableFields");

filters.forEach(filter => {

  filter.addEventListener("change", (e) => {

    filterData[filter.id] = e.target.value;

    filterData.page = 1;

    getMovieList(
      filterData.query_term,
      filterData.quality,
      filterData.genre,
      filterData.rating,
      filterData.year,
      filterData.page
    );

  });

});


// =========================
// INITIAL LOAD
// =========================

getMovieList(
  filterData.query_term,
  filterData.quality,
  filterData.genre,
  filterData.rating,
  filterData.year,
  filterData.page
);