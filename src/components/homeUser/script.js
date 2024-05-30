

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
    let event=e.target;
    if(!event.className.includes("material-symbols-outlined") && !event.className.includes("searchHidden")){
        searchHidden.classList.remove("viewSearch");
    }
});



//main
import { 
    readFile ,
    deletePet,
    viewMedicalHistory,
    getUrlParams
} from "/services/servicesMedic.js";


class duplicateId extends Error{
    constructor(message){
        super(message);
    }
}

class notFoundId extends Error{
    constructor(message){
        super(message);
    }
}

class EmailNotFound extends Error{
    constructor(message){
        super(message);
    }
}



class rangeId extends Error{
    constructor(message){
        super(message);
    }
}


class datesInvalid extends Error{
    constructor(message){
        super(message);
    }
}

class completeName extends Error{
    constructor(message){
        super(message);
    }
}

class invalidPhone extends Error{
    constructor(message){
        super(message);
    }
}

class improvePassword extends Error{
    constructor(message){
        super(message);
    }
}



let containerInformation=document.querySelector(".innerPart");

let exit=document.querySelector(".exit"); // elemetno que dice exit sesion
// let perfil=document.querySelector(".perfil");

let containerDeleteProfiles=document.querySelector(".containerDeleteProfiles"); //formulario desplegable para create nuevo veterinaria

// let containerPatients=document.querySelector(".containerPatients");//container donde se mostraran sus profiles

let viewHistory=document.querySelector(".viewHistory"); // bottom de create profiles

let equis=document.querySelector(".equis");


let viewMenu=document.querySelector(".viewMenu2"); //bottom para view profiles


let optionsNav=document.querySelector(".containerOptions");


let deletePatientNow=document.querySelector(".patientsDelete");

let changePhoto=document.querySelector(".photo");

let containerPhoto=document.querySelector(".containerPhoto");

let inputPhoto=document.querySelector(".inputPhoto");

let buttonForDelete=document.querySelector(".acept");

let buttonForReturnDelete=document.querySelector(".cancel");






//Eventos y demas cosas que involucren la base de datos


let solicitud=indexedDB.open("datos");
var baseDatos;
solicitud.onsuccess=function(){
    
    baseDatos=solicitud.result;
    
    console.log("todo bien");

    // dataDoctor();

    // dataVete()
    // dataPet();


buttonForDelete.addEventListener("click",()=>{
    getUrlParams()
    .then((id)=>{
        deletePet(baseDatos,id)
        .then(()=>{
            window.location.replace("/src/components/accessPage/index.html");;
        })
        .catch()
    })
    .catch();
});


buttonForReturnDelete.addEventListener("click",()=>{
    containerDeleteProfiles.classList.toggle("viewForm");
});

//_________________________________________

    
    showPhotoInContainer(baseDatos)
        .then((url)=>{
            containerPhoto.innerHTML=`<img src='${url}'  class="show" alt='Pon una foto'>`;
        })
        .catch((err)=>{alert(err);});


    //______________________________________________
    
    validateloginUser(baseDatos)  //Activamos funcion para extraer del medico:nombre,id,correo,Numero nit 
    .then((information)=>{  //information equivale a todo lo antes dichos envuelto en una array
       
    })
    .catch((error)=>{
        if(error instanceof EmailNotFound){
            console.log(error.message);
        }
    })
    

    //______________________________________________


    //Evento para cuando cierren sesion desactivar el perfil
    
    exit.addEventListener("click",(e)=>{
        window.location.replace("/src/components/accessPage/index.html");
    });
    
   
    //______________________________________________
    

    // Eventos encargados para que todo lo que tenga que ver con cambio de foto salga bien
  
inputPhoto.addEventListener("change",(e)=>{
    let question=confirm("Quieres establecer esta foto?");
    if(question){   
        readFile(inputPhoto.files[0])           //mandamos como parametro el primer archiv seleccionado 
        .then((url)=>{
            changeUrlPhoto(url)     //Esta funcion le pasamos como parametro url de la imagen para que haga la actualizacion
            .then(()=>{
                // alert(url);
                location.reload();
            })
            .catch((err)=>alert("No se pudo cambiar la foto "))
            
        })
        .catch();
    }
});


returnActivePet()
.then((dates)=>{
   let container=document.querySelector(".containerFeed");

   viewMedicalHistory(baseDatos,dates[0],dates[1],dates[2])
   .then((data)=>{          
        container.classList.add("viewClinicalHistory");
        container.innerHTML=data;
   })

   .catch(()=>{
        container.innerHTML=`<h1>Hasta el momento no hay historias clinicas para mostrar</h1>`
   });
})
.catch(()=>{
    alert("no hay nada");
});



let saveVetButton = document.querySelector("#saveVetButton");

saveVetButton.addEventListener("click", (e) => {
  let vetFields = document.querySelectorAll(".vetFields");
  vetFields.forEach(function (element) {
    element.style.display = "block";
  });

  let updateFields = document.querySelectorAll(".updateFields");
  updateFields.forEach(function (element) {
    element.style.display = "none";
  });

  updateButton.style.display = "block";
  saveVetButton.style.display = "none";

  updateData()
    .then(() => {
        location.reload();
    })
    .catch((err) => alert(err));
});
 



}




//EVENTOS



//Pequeño evento para desplegar el formulario para create un nuevo vet


deletePatientNow.addEventListener("click",(e)=>{
    optionsNav.classList.remove("viewOptions");
    containerDeleteProfiles.classList.toggle("viewForm"); //al contenedor con display none le damos una nuevo clase
});


equis.addEventListener("click",(e)=>{
    containerDeleteProfiles.classList.toggle("viewForm");
});


viewMenu.addEventListener("click",(e)=>{
    e.preventDefault();
    optionsNav.classList.toggle("viewOptions");
    containerDeleteProfiles.classList.remove("viewForm");
});


changePhoto.addEventListener("click",(e)=>{
    inputPhoto.click();
});



containerPhoto.addEventListener("click",(e)=>{
    inputPhoto.click();

});

viewHistory.addEventListener("click",()=>{
    document.querySelector(".goHistory").click();
});



const showPhotoInContainer=(baseDatos)=>{
    return new Promise((resolve,reject)=>{
       getUrlParams()
       .then((id)=>{
        let transaction=baseDatos.transaction("profiles-pets");
        let objectStore=transaction.objectStore("profiles-pets");
        let cursor=objectStore.openCursor();

        cursor.onsuccess=(e)=>{
            let puntero=e.target.result;
            if(puntero){
                if(puntero.key==id){
                    resolve(puntero.value.urlPhotoPets);
                }                                                   //EXPORTAR
                puntero.continue();
            }
            else{
                reject("no hay ninguna url");
            }
        }
       })
       .catch()
    });
}


const validateloginUser=(baseDatos)=>{
    return new Promise((resolve,reject)=>{
       getUrlParams()
       .then((id)=>{
        let transaccionFalse=baseDatos.transaction("profiles-pets");
        let objectStore=transaccionFalse.objectStore("profiles-pets");
        
        let cursor=objectStore.openCursor();
        
        cursor.onsuccess = (e) => {
            let puntero = e.target.result;
            if (puntero) {
              if (puntero.key == id) {
                let value = puntero.value;
                document.querySelector("#Name").innerHTML = puntero.value.name;
                document.querySelector("#Specie").innerHTML = puntero.value.specie;
                document.querySelector("#raza").innerHTML = puntero.value.raza;
                document.querySelector("#age").innerHTML = puntero.value.age;
                document.querySelector("#address").innerHTML = puntero.value.directionHouse;
                document.querySelector("#phone").innerHTML = puntero.value.ownerPhone;
                document.querySelector("#owner").innerHTML = puntero.value.ownerName;

                document.querySelector("#updateName").value = puntero.value.name;
                document.querySelector("#updateAge").value = puntero.value.age;
                document.querySelector("#updatePhone").value = puntero.value.ownerPhone;
                document.querySelector("#updateOwner").value = puntero.value.ownerName;
                document.querySelector("#updateAddress").value = puntero.value.directionHouse;
              
                resolve();
              }
              puntero.continue();
            } 
          }   
       })

       .catch();
    });
}


const returnActivePet=()=>{
    return new Promise((resolve,reject)=>{
        getUrlParams()
        .then((id)=>{
            let transaction=baseDatos.transaction("profiles-pets");
            let objectStore=transaction.objectStore("profiles-pets");
            let cursor=objectStore.openCursor();
            cursor.onsuccess=(e)=>{
                let puntero=e.target.result;
                if(puntero){
                    let value=puntero.value;
                    if(puntero.key==id){
                        resolve([value.idOwnerPet,
                            value.name,
                            value.medicalIdInCharge])
                        return;
                    }
                    puntero.continue();
                }
            }
        
            cursor.onerror=()=>{
                reject("No hay nada activo");
            }
        })
        .catch();
    });
 }
 

 
const updateData = () => {
    return new Promise((resolve, reject) => {
        getUrlParams()
        .then((id) => {
          let name = document.querySelector("#updateName").value;
          let age = document.querySelector("#updateAge").value;
          let phone = document.querySelector("#updatePhone").value;
          let owner = document.querySelector("#updateOwner").value;
          let address = document.querySelector("#updateAddress").value;
  
          let transaction = baseDatos.transaction("profiles-pets", "readwrite");
          let openStore = transaction.objectStore("profiles-pets");
  
          let cursor = openStore.openCursor();

          

          transaction.onerror=()=>{
            reject("ERROR");
          }

          let cursorStopped=false;
  
          cursor.addEventListener("success", (e) => {
            let puntero = e.target.result;
            if (puntero && !cursorStopped) {
              if (puntero.key == id) {

                let value2 = puntero.value;
                value2.name = name;
                value2.age = age;
                value2.ownerPhone = phone;
                value2.ownerName = owner;
                value2.directionHouse = address;
                
                puntero.update(value2);
                transaction.oncomplete = () => {
                    resolve();
                  };


                cursorStopped=true;
               
              }
  
              puntero.continue();
            } 
          });
        })

        .catch((err) => {

          throw new Error("No se pudo identificar ninguna id activa");
        });

    });
  };


  const changeUrlPhoto=(url)=>{
    return new Promise((resolve,reject)=>{
       getUrlParams()
       .then((id)=>{
        let transaction=baseDatos.transaction("profiles-pets","readwrite");
        let objectStore=transaction.objectStore("profiles-pets");
        let cursor=objectStore.openCursor();

        cursor.onsuccess=(e)=>{
            let puntero=e.target.result;
            if(puntero){
                if(puntero.key==id){              //EXPORTAR
                    let valueChange=puntero.value;

                    valueChange.urlPhotoPets=url;
                    puntero.update(valueChange);
                   
                    transaction.oncomplete=()=>{
                        resolve();
                    }
                }
                puntero.continue();
            }
        }
        cursor.onerror=()=>{
            reject("No se pudo cambiar la foto de perfil");
        }
       })

       .catch();
    });
}



  
let updateButton = document.querySelector("#updateButton");
updateButton.addEventListener("click", (e) => {
  let vetFields = document.querySelectorAll(".vetFields");
  vetFields.forEach(function (element) {
    element.style.display = "none";
  });

  let updateFields = document.querySelectorAll(".updateFields");
  updateFields.forEach(function (element) {
    element.style.display = "block";
  });

  updateButton.style.display = "none";

  let saveVetButton = document.querySelector("#saveVetButton");
  saveVetButton.style.display = "block";
});

