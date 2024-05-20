// page header and footer script
let icon=document.querySelector(".material-symbols-outlined");
let menuHidden=document.querySelector(".menuHidden");
let searchHidden=document.querySelector(".searchHidden");


icon.addEventListener("click",(e)=>{
    menuHidden.classList.toggle("viewMenu");
    searchHidden.classList.remove("viewSearch");
});

let search=document.querySelector(".material-symbols-outlined1");

search.addEventListener("click",(e)=>{
    menuHidden.classList.remove("viewMenu");
    searchHidden.classList.toggle("viewSearch");
});