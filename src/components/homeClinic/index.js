//Section 1
// OPEN SUBMENU
//Add a click event to the browser window that triggers a function with the window information in the "e" parameter. 
window.addEventListener('click', function(e){   
//If the click target is menuIcon then enter the if statement.
    if (document.getElementById('menuIcon').contains(e.target)){
        //Get the width of gridSubMenu and if is equal to 8 then enter the if statement.
        if (document.getElementById("gridSubMenu").offsetWidth == 8){
                //Change the value of the width in gridSubmenu to 110%.
                document.getElementById("gridSubMenu").style.width = "110%";
            }
            //If the width the gridSubmenu is different than 8 enter the else statement.
            else{
                //Change the value of the width in gridSubmenu for 1%.
                document.getElementById("gridSubMenu").style.width = "1%";
            } 
    //If the click target is not menuIcon the enter the else statement.    
    }
    //If the click target is not gridSubMenu, enter the if statement.
    else if (!document.getElementById('gridSubMenu').contains(e.target)){
        //Change the value of the width in gridSubmenu for 1%.
        document.getElementById("gridSubMenu").style.width = "1%";
    }
  });