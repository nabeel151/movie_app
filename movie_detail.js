const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

const container = document.getElementById("movie");

container.innerHTML = `
  <div class="flex justify-center items-center h-[400px]">
    <div class="w-12 h-12 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
`;

getMovieDetails();

async function getMovieDetails() {

  const url = `https://movies-api.accel.li/api/v2/movie_details.json?movie_id=${movieId}&with_images=true&with_cast=true`;

  try {

    const response = await fetch(url);
    const resJson = await response.json();

    const movie = resJson.data.movie;

    container.innerHTML = `
      <div class="grid lg:grid-cols-12 gap-5 bg-[#1e1e1e] p-4 rounded-xl max-w-6xl mx-auto">

        <!-- LEFT SIDE -->
        <div class="lg:col-span-4">

          <img
            src="${movie.large_cover_image}"
            class="w-full h-[500px] object-cover rounded-xl"
          />

          <a
            href="${movie.url}"
            target="_blank"
            class="mt-5 bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-lg flex items-center justify-center font-bold text-lg transition"
          >
            Download
          </a>

        </div>

        <!-- RIGHT SIDE -->
        <div class="lg:col-span-8 text-white">

          <h1 class="text-3xl md:text-4xl font-bold mb-4">
            ${movie.title_long}
          </h1>

          <p class="text-gray-300 mb-4">
            ${movie.year} • ⭐ ${movie.rating}/10
          </p>

          <p class="text-gray-300 mb-5">
            ${movie.description_full}
          </p>

          <!-- GENRES -->
          <div class="flex flex-wrap gap-3 mb-6">
            ${movie.genres.map(genre => `
              <span class="bg-gray-800 px-4 py-2 rounded-full">
                ${genre}
              </span>
            `).join("")}
          </div>

          <!--  SUGGESTED MOVIES SECTION -->
          <div class="mt-6">
            <h2 class="text-xl font-bold text-white mb-4">
              Suggested Movies
            </h2>

        <div id="suggestions" class="grid grid-cols-3 md:grid-cols-4 gap-2"></div>
          </div>

        </div>
      </div>
    `;

    // IMPORTANT: use movie.id from API
    getMovieSuggestions(movie.id);

  } catch (error) {
    console.log(error);

    container.innerHTML = `
      <h1 class="text-red-500 text-3xl text-center">
        Failed to load movie
      </h1>

    `;
  }
}


async function getMovieSuggestions(movieId) {

  const suggestionContainer = document.getElementById("suggestions");

  const url = `https://movies-api.accel.li/api/v2/movie_suggestions.json?movie_id=${movieId}`;

  try {

    const response = await fetch(url);
    const data = await response.json();

    console.log("Suggestions API:", data);

    const movies = data.data?.movies || data.movies || [];

    suggestionContainer.innerHTML = "";

    if (movies.length === 0) {
      suggestionContainer.innerHTML = `
        <p class="text-gray-400 text-sm">No suggestions found</p>
      `;
      return;
    }

    movies.forEach(movie => {

      const div = document.createElement("div");

      div.className = `
        bg-gray-800 rounded-lg overflow-hidden cursor-pointer
        hover:scale-105 transition
      `;

      div.innerHTML = `
        <img src="${movie.medium_cover_image}" class="w-full h-32 object-cover">

        <div class="p-2">
          <h4 class="text-sm font-semibold truncate">
            ${movie.title}
          </h4>

          <p class="text-xs text-gray-400">
            ${movie.year} • ⭐ ${movie.rating}
          </p>
        </div>
      `;

      // click to open new movie
      div.onclick = () => {
        window.location.href = `movie.html?id=${movie.id}`;
      };

      suggestionContainer.appendChild(div);
    });

  } catch (error) {
    console.error("Suggestion Error:", error);
  }
}