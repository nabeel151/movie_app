
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


async function getMovieList() {
  const url = "https://movies-api.accel.li/api/v2/list_movies.json";

  try {
    const response = await fetch(url);
    const resJson = await response.json();

    const movies = resJson.data.movies;

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

        <div class="aspect-[2/3] w-full border-[3px] border-white overflow-hidden rounded-sm transition group-hover:scale-105">

          <img 
            src="${movie.medium_cover_image}" 
            class="w-full h-full object-cover"
          >

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

// 👉 Only call this
getMovieList();


