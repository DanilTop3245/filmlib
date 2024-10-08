/******************************Infinity Scroll**************************/
const elements = {
  list: document.querySelector(".js-movie-list"),
  guard: document.querySelector(".js-guard"),
};

const options = {
  root: null,
  rootMargin: "300px",
};

const observer = new IntersectionObserver(handlerLoadMore, options);

let page = 1;
serviceMovie(page)
  .then((data) => {
    elements.list.insertAdjacentHTML("afterbegin", createMarkup(data.results));
    
    if (data.page < data.total_pages) {
      observer.observe(elements.guard);
    }
  })
  .catch((err) => console.log(err));



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

// let counterObserver = 0
function handlerLoadMore(entries, observer) {
  // counterObserver += 1;
  // console.log("counterObserver: ", counterObserver);
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      page += 1;
      serviceMovie(page)
        .then((data) => {
          elements.list.insertAdjacentHTML(
            "beforeend",
            createMarkup(data.results)
          );

          if (data.page >= 500) {
            observer.unobserve(elements.guard)
          }
        })
        .catch((err) => console.log(err));
    }
  });
}

// document.addEventListener('scroll', handlerScroll)

// let counterScroll = 0
// function handlerScroll() {
//   counterScroll += 1
//   console.log("counterScroll: ", counterScroll);
// }