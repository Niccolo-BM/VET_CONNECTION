// page header and footer script
let icon=document.querySelector(".material-symbols-outlined");
let menuHidden=document.querySelector(".menuHidden");
let searchHidden=document.querySelector(".searchHidden");
let body=document.querySelector(".body");

icon.addEventListener("click",(e)=>{
    menuHidden.classList.toggle("viewMenu");
    searchHidden.classList.remove("viewSearch");
});

let search=document.querySelector(".material-symbols-outlined1");

let imgSearch=document.querySelector("#img3");

imgSearch.addEventListener("click",(e)=>{
    // alert("entra");
    menuHidden.classList.remove("viewMenu");
    searchHidden.classList.toggle("viewSearch");
});

// body.addEventListener("click",(e)=>{
//     let evento=e.target;
//     if(!evento.className.includes("material-symbols-outlined")  !evento.className.includes("material-symbols-outlined1") ){
//         menuHidden.classList.remove("viewMenu");
//         searchHidden.classList.remove("viewSearch");
//     }
// })


//MAIN

let currentIndex = 0;

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    if (index >= slides.length) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = slides.length - 1;
    } else {
        currentIndex = index;
    }
    const offset = -currentIndex * 100;
    document.querySelector('.slides').style.transform = `translateX(${offset}%)`;
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === currentIndex);
    });
}

function moveSlide(direction) {
    showSlide(currentIndex + direction);
}

function currentSlide(index) {
    showSlide(index);
}

// asi comieza con la priera imagen
showSlide(currentIndex);