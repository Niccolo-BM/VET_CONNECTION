//Header y footer

let icon = document.querySelector(".material-symbols-outlined");
let menuHidden = document.querySelector(".menuHidden");
let searchHidden = document.querySelector(".searchHidden");
let body = document.querySelector(".body");

icon.addEventListener("click", (e) => {
  menuHidden.classList.toggle("viewMenu");
  searchHidden.classList.remove("viewSearch");
});

let search = document.querySelector(".material-symbols-outlined1");

search.addEventListener("click", (e) => {
  menuHidden.classList.remove("viewMenu");
  searchHidden.classList.toggle("viewSearch");
});

let btnFreePlan = document.querySelector("#btnFreePlan");
btnFreePlan.addEventListener("click", (e) => {
  window.location.replace("../login/index.html");
});