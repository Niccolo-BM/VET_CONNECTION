import { showPhotoInContainer,
    viewMedicalHistory,
    obtainDatesPets,
    readFile,
    uploaData,
    getUrlParams,
   deletePet,
 } from "/services/servicesMedic.js";


 import{
    getIdDoctorUrl,
    getUrlParams2
 }
from"/services/servicesUser.js"
//creation of custom errors

class EmailNotFound extends Error{
    constructor(message){
        super(message);
    }
}

class badEmailEstructure extends Error{
    constructor(message){
        super(message);
    }
}

class notFoundId extends Error{
    constructor(message){
        super(message);
    }
}

class CedulaNotFound extends Error{
    constructor(message){
        super(message);
    }
}

class cedulaLength extends Error{
    constructor(message){
        super(message);
    }
}

class onlyNumbers extends Error{
    constructor(message){
        super(message);
    }
}


class duplicateCedula extends Error{
    constructor(message){
        super(message);
    }
}

class inicioNotFound extends Error{
    constructor(message){
        super(message);
    }
}




//end personality erros

let icon=document.querySelector(".material-symbols-outlined");
let menuHidden=document.querySelector(".menuHidden");
let searchHidden=document.querySelector(".searchHidden");
let body=document.querySelector(".body");

icon.addEventListener("click",(e)=>{
    menuHidden.classList.toggle("viewMenuOptions");
    searchHidden.classList.remove("viewSearch");
});

let search=document.querySelector(".material-symbols-outlined1");

search.addEventListener("click",(e)=>{
    menuHidden.classList.remove("viewMenuOptions");
    searchHidden.classList.toggle("viewSearch");
});

body.addEventListener("click",(e)=>{
    let event=e.target;
    if(!event.className.includes("material-symbols-outlined") && !event.className.includes("searchHidden")){
        searchHidden.classList.remove("viewSearch");
    }
});


/*ZONA ELEMENTOS HTML*/





let containerInformation=document.querySelector(".innerPart");

let exit=document.querySelector(".exit"); // elemetno que dice exit sesion
// let perfil=document.querySelector(".perfil");

let containerDeleteProfiles=document.querySelector(".containerDeleteProfiles"); //formulario desplegable para create nuevo veterinaria

// let containerPatients=document.querySelector(".containerPatients");//container donde se mostraran sus profiles

let viewHistory=document.querySelector(".viewHistory"); // bottom de create profiles

let equis2=document.querySelector(".equis2");


let viewMenu=document.querySelector(".viewMenu2"); //bottom para view profiles


let optionsNav=document.querySelector(".containerOptions");


let deletePatientNow=document.querySelector(".patientsDelete");

let changePhoto=document.querySelector(".photo");

let containerPhoto=document.querySelector(".containerPhoto");

let inputPhoto=document.querySelector(".inputPhoto");

let buttonForDelete=document.querySelector(".acept");

let buttonForReturnDelete=document.querySelector(".cancel");


let send=document.querySelector(".send");

let container=document.querySelector(".containerFeed");

let containerSecurity=document.querySelector(".containerSecurity");

let containerOverlay=document.querySelector(".containerOverlay");

let createProfileAnimal=document.querySelector(".instanceProfile");


// let title=document.querySelector(".quitar");





//APERTURA BASE DE DATOS

var solicitud=indexedDB.open("datos"); 

var baseDatos ;

solicitud.onerror=()=>{     //Primer evento de la base de datos que es el error
    alert("Ocurrio un error")
}


/*Eventos , promesas relacionados con la busqueda de datos*/

solicitud.onsuccess=()=>{ // Segundo evento de la base de datos que escuando todo sale bien
    baseDatos=solicitud.result;
    console.log("Se abrio correctamnete la base de datos");


    changeTitleHistory();  //Funcion que cambia titulado del container de historia clinica


//______________________________________
    


buttonForDelete.addEventListener("click",()=>{
   getUrlParams2()
   .then((id)=>{
    deletePet(baseDatos,id)
    .then(()=>{
        getIdDoctorUrl()
        .then((idDoctor)=>{
            window.location.replace("/src/components/homeMedic/index.html?id="+idDoctor);
        })
        .catch();
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
            containerPhoto.innerHTML+=`<img src='${url}'  class="show" alt='Pon una foto'>`;
        })
        .catch((err)=>{alert(err);});



//_________________________________________


      
    validateloginUser(baseDatos)  //Activamos funcion para extraer del medico:nombre,id,correo,Numero nit 
    .then(()=>{  //information equivale a todo lo antes dichos envuelto en una array
    })
    .catch((error)=>{//Manejando posibles errores que puedan suceder
            console.log(error.message);
            alert(error.message);
       
    })

//_________________________________________





returnActivePet()
.then((data)=>{
   let container=document.querySelector(".containerFeed");
    
   viewMedicalHistory(baseDatos,data[0],data[1],data[2])
   .then((data)=>{          
        container.classList.add("viewClinicalHistory");
        container.innerHTML=data
   })

   .catch(()=>{
        container.innerHTML=`<h1>Hasta el momento no hay historias clinicas para mostrar</h1>`
   });
})
.catch(()=>{
    alert("no hay nada");
});



//_________________________________________

    send.addEventListener("click", (e) => {  //evento para cuando se cree una historia clinica regresar una ventana modal
        e.preventDefault();
        
      obtainDatesPets(baseDatos)

      .then((dates)=>{        
                containerSecurity.classList.toggle("returnModal");
                containerOverlay.classList.toggle("big");
                
                containerSecurity.addEventListener("click",(e)=>{
                    let evento=e.target;
                    if(evento.className=="aceptar"){
                        uploaData(baseDatos,dates[0],dates[1],dates[2])
                        .then(()=>{
                            location.reload();        
                        })
                        .catch((err)=>{
                            alert(err)
                        });                 
                    }

                    else if(evento.className.includes("cancelar")){
                        containerSecurity.classList.toggle("returnModal");
                        containerOverlay.classList.toggle("big");
                    }
                })      
      })
      .catch((error)=>{
            alert(error.message);
      });
    });



    //evento para cuando den cerrar sesion
    exit.addEventListener("click",()=>{
        getIdDoctorUrl()
        .then((idDoctor)=>{
            window.location.replace("/src/components/homeMedic/index.html?id="+idDoctor);
        })
        .catch();
    });

// EVENTOS DE CAMBIO DE FOTO


    // Eventos encargados para que todo lo que tenga que ver con cambio de foto salga bien
    inputPhoto.addEventListener("change",(e)=>{
        let question=confirm("Quieres establecer esta foto?");
        if(question){   
            readFile(inputPhoto.files[0])           //mandamos como parametro el primer archiv seleccionado 
            .then((url)=>{
                changeUrlPhoto(url)     //Esta funcion le pasamos como parametro url de la imagen para que haga la actualizacion
                .then(()=>{
                    location.reload();
                })
                .catch((err)=>alert("No se pudo cambiar la foto "))
                
            })
            .catch();
        }
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







// _________________________________________________________________________________________________________________

/*Event for show feedback*/ 

//EVENTS


// ______________________

let viewProfiles=document.querySelector(".viewProfiles"); //bottom para view profiles
    
viewMenu.addEventListener("click",(e)=>{
    optionsNav.classList.toggle("viewOptions");
});

// End of this event


viewHistory.addEventListener("click",()=>{
    document.querySelector(".form1").classList.toggle("viewForm2");
});



equis2.addEventListener("click",()=>{
    document.querySelector(".form1").classList.remove("viewForm2");;
});


changePhoto.addEventListener("click",()=>{
    inputPhoto.click();
});

containerPhoto.addEventListener("click",(e)=>{
    inputPhoto.click();

});



deletePatientNow.addEventListener("click",(e)=>{
    optionsNav.classList.remove("viewOptions");
    containerDeleteProfiles.classList.toggle("viewForm"); //al contenedor con display none le damos una nuevo clase
});





//INICIO DE FUNCIONES

// Evento para cerrar sesion

// _________________________________________________

const changeTitleHistory=()=>{//Funcion unicamente para hacer un titulado personalizado del animal
    let titleH1=document.querySelector(".titleAdd");
    let transactionValue=baseDatos.transaction("profiles-pets");
    let objectStore=transactionValue.objectStore("profiles-pets");
    let cursor=objectStore.openCursor();

    cursor.addEventListener("success",(e)=>{
        let puntero=e.target.result;
        if(puntero){
            if(puntero.value.startProfile==true){
                titleH1.innerHTML=`Crear historia clinica para ${puntero.value.name}`;
            }
            puntero.continue();
        }
    });
}



const validateloginUser=(baseDatos)=>{
    return new Promise((resolve,reject)=>{
       getUrlParams2()
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
        getUrlParams2()
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
 




// _________________________________________________


 
const updateData = () => {
    return new Promise((resolve, reject) => {
        getUrlParams2()
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
       getUrlParams2()
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
