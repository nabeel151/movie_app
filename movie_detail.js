const movieId = localStorage.getItem("movieId");

const container = document.getElementById("movieDetails");

async function getMovieDetails() {
    const url = `https://movies-api.accel.li/api/v2/movie_details.json?movie_id=${movieId}&with_images=true&with_cast=true`;

    try {
        const response = await fetch(url);
        const resJson = await response.json();

        const movie = resJson.data.movie;
        //  console.log(movie);

        container.innerHTML = `
    
      <div class="grid md:grid-cols-2 gap-10">

        <img src="${movie.medium_cover_image}" class="rounded-lg w-full">

        <div>

          <h1 class="text-3xl font-bold mb-2">${movie.title}</h1>

          <p class="text-gray-400 mb-4">${movie.year} • Rating: ${movie.rating}/10</p>

          <p class="text-gray-300 mb-6">${movie.description_full}</p>

          <div class="flex flex-wrap gap-2 mb-6">
            ${movie.genres
                ? movie.genres.map(g => `
                  <span class="px-3 py-1 border border-blue-600 text-blue-400 rounded-full text-sm">
                    ${g}
                  </span>
                `).join("")
                : ""
            }
          </div>

          <a href="${movie.url}" target="_blank"
             class="px-5 py-2 bg-blue-600 text-black font-bold rounded-full">
            Watch / Download
          </a>

        </div>

      </div>

    `;
    } catch (error) {
        console.log(error);
        container.innerHTML = "<p class='text-red-500'>Failed to load movie</p>";
    }
}

getMovieDetails();