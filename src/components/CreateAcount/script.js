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

search.addEventListener("click",(e)=>{
    menuHidden.classList.remove("viewMenu");
    searchHidden.classList.toggle("viewSearch");
});

body.addEventListener("click",(e)=>{
    let evento=e.target;
    if(!evento.className.includes("material-symbols-outlined") && !evento.className.includes("material-symbols-outlined1") ){
        menuHidden.classList.remove("viewMenu");
        searchHidden.classList.remove("viewSearch");
    }

});


//*main*//
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
    } 
    else {
        
        alert('Enviado con éxito!');
       }
       
   const registerForm = document.getElementById('registerForm');
       registerForm.reset();
});
