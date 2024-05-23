//Header y footer

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

//CLINIC PROFILE
//Section 1
// OPEN SUBMENU
//Add a click event to the browser window that triggers a function with the window information in the "e" parameter. 
window.addEventListener('click', function(e){   
//If the click target is menuIcon then enter the if statement.
    if (document.getElementById('menuIcon').contains(e.target)){
        document.getElementById("gridSubMenu").style.display="grid";
        //Get the width of gridSubMenu and if is equal to 8 then enter the if statement.
        if (document.getElementById("gridSubMenu").offsetWidth == 4){
                //Change the value of the width in gridSubmenu to 115%.            
                document.getElementById("gridSubMenu").style.width = "115%";
            }
            //If the width the gridSubmenu is different than 8 enter the else statement.
            else{
                //Change the value of the width in gridSubmenu for 1%.
                document.getElementById("gridSubMenu").style.width = "1%";
                setTimeout(() => {
                    document.getElementById("gridSubMenu").style.display="none";
                }, 2000);
                
            } 
    //If the click target is not menuIcon the enter the else statement.    
    }
    //If the click target is not gridSubMenu, enter the if statement.
    else if (!document.getElementById('gridSubMenu').contains(e.target)){
        //Change the value of the width in gridSubmenu for 1%.
        document.getElementById("gridSubMenu").style.width = "1%";
        setTimeout(() => {
            document.getElementById("gridSubMenu").style.display="none";
        }, 2000);
    }
  });




