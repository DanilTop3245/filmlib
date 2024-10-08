// *********** Кнопка "Load More" ***************** \\
const elements = {
  loadMore: document.querySelector(".js-load-more"),
  list: document.querySelector(".js-movie-list"),
};
let page = 1;

elements.loadMore.addEventListener("click", handlerLoadMore);
serviceMovie(page)
  .then((data) => {
    elements.list.insertAdjacentHTML("afterbegin", createMarkup(data.results));
    if (data.page < data.total_pages) {
      elements.loadMore.classList.remove("load-more-hidden");
    }
  })
  .catch((err) => console.log(err));

function handlerLoadMore() {
  page += 1;
  serviceMovie(page)
    .then((data) => {
      elements.list.insertAdjacentHTML(
        "beforeend",
        createMarkup(data.results)
      );
      if (data.page >= 500) {
        elements.loadMore.classList.add("load-more-hidden");
      }
    })
    .catch((err) => console.log(err));
}

function serviceMovie(page = 1) {
  const BASE_URL = "https://api.themoviedb.org/3";
  const END_POINT = "/trending/movie/week";
  const API_KEY = "bab33614b798fee8ae37f7b212fb1648";
  const params = new URLSearchParams({
    api_key: API_KEY,
    page,
  });

  return fetch(`${BASE_URL}${END_POINT}?${params}`).then((resp) => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    return resp.json();
  });
}

function createMarkup(arr) {
  return arr
    .map(
      ({ poster_path, original_title, release_date, vote_average }) => `
  <li class="movie-card">
        <img src="https://image.tmdb.org/t/p/w300${poster_path}" loading="lazy" alt="${original_title}">
        <div class="movie-info">
            <h2>${original_title}</h2>
            <p>Release date: ${release_date}</p>
            <p>Average vote: ${vote_average}</p>
        </div>
  </li>`
    )
    .join("");
}
