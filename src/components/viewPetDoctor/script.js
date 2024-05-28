import { showPhotoInContainer,
    validateloginUser,
    returnActivePet,
    viewMedicalHistory,
    obtainDoctorID,
    uploaData,
    readFile,
    changeUrlPhoto,
    idPet,deletePet
 } from "/services/servicesMedic.js";

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



/*ZONA ELEMENTOS HTML*/









let containerInformation=document.querySelector(".innerPart");

let exit=document.querySelector(".exit"); // elemetno que dice exit sesion
// let perfil=document.querySelector(".perfil");

let containerDeleteProfiles=document.querySelector(".containerDeleteProfiles"); //formulario desplegable para create nuevo veterinaria

// let containerPatients=document.querySelector(".containerPatients");//container donde se mostraran sus profiles

let viewHistory=document.querySelector(".viewHistory"); // bottom de create profiles

let equis2=document.querySelector(".equis2");


let viewMenu=document.querySelector(".viewMenu"); //bottom para view profiles


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

let updateData=document.querySelector(".updateData");

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
    idPet(baseDatos)
    .then((id)=>{
        deletePet(baseDatos,id)
        .then(()=>{
            window.location.replace("/nuevo prototipo/Acces.html");;
        })
        .catch()
    })
    .catch(()=>{
        alert("No se pudo eliminar el perfil");
    })
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
    .then((information)=>{  //information equivale a todo lo antes dichos envuelto en una array
            document.querySelector(".namePet").value=information[0];
            document.querySelector(".nameOwner").value=information[2];
            document.querySelector(".phoneOwner").value=information[3];
            document.querySelector(".agePet").value=information[4];
            document.querySelector(".addressPet").value=information[5];
            document.querySelector(".idOwner").value=information[1];
            document.querySelector(".raza").value=information[6];
    
    })
    .catch((error)=>{//Manejando posibles errores que puedan suceder
            console.log(error.message);
            alert(error.message);
       
    })

//_________________________________________





returnActivePet(baseDatos)
.then((dates)=>{
   let container=document.querySelector(".containerFeed");
    
   viewMedicalHistory(baseDatos,dates[0],dates[1])
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

    


    validateloginUser(baseDatos)  //Volvemos a llamar a la funcion que identifica el perfil activo para sacar la cedula asociada
    .then((information)=>{
        identifyOtherPets(information[1]);
    })
    .catch((e)=>{})


    send.addEventListener("click", (e) => {  //evento para cuando se cree una historia clinica regresar una ventana modal
        e.preventDefault();
        
      obtainDoctorID(baseDatos)

      .then((dates)=>{        
                containerSecurity.classList.toggle("returnModal");
                containerOverlay.classList.toggle("big");
                
                containerSecurity.addEventListener("click",(e)=>{
                    let evento=e.target;
                    if(evento.className=="aceptar"){
                        uploaData(baseDatos,dates[0],dates[1])
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
        changeLoggedValue()
        .then(()=>{
            window.location.replace("/src/components/homeMedic/index.html");
        })
        .catch((e)=>{alert(e)});
    });

// EVENTOS DE CAMBIO DE FOTO


    // Eventos encargados para que todo lo que tenga que ver con cambio de foto salga bien
    inputPhoto.addEventListener("change",(e)=>{
        let question=confirm("Quieres establecer esta foto?");
        if(question){   
            readFile(inputPhoto.files[0])           //mandamos como parametro el primer archiv seleccionado 
            .then((url)=>{
                changeUrlPhoto(baseDatos,url)     //Esta funcion le pasamos como parametro url de la imagen para que haga la actualizacion
                .then(()=>{
                    location.reload();
                })
                .catch((err)=>alert("No se pudo cambiar la foto "))
                
            })
            .catch();
        }
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


let boolean=false;
updateData.addEventListener("click",()=>{
   if(!boolean){
    boolean=true;
    document.querySelector(".namePet").removeAttribute("disabled");
    document.querySelector(".nameOwner").removeAttribute("disabled");
    document.querySelector(".phoneOwner").removeAttribute("disabled");
    document.querySelector(".agePet").removeAttribute("disabled");
    document.querySelector(".addressPet").removeAttribute("disabled");
    document.querySelector(".idOwner").removeAttribute("disabled");
    document.querySelector(".raza").removeAttribute("disabled");
    
    updateData.innerHTML=`Guardar Datos`;
   }

   else{
    boolean=false;
    document.querySelector(".namePet").setAttribute("disabled");
    document.querySelector(".nameOwner").setAttribute("disabled");
    document.querySelector(".phoneOwner").setAttribute("disabled");
    document.querySelector(".agePet").setAttribute("disabled");
    document.querySelector(".addressPet").setAttribute("disabled");
    document.querySelector(".idOwner").setAttribute("disabled");
    document.querySelector(".raza").setAttribute("disabled");

    updateData.innerHTML=`Actulizar Datos`;

   }
});


// _________________________________________________________________________________________________________________


//INICIO DE FUNCIONES

// Evento para cerrar sesion


const changeLoggedValue=()=>{  //Funcion para desactivar el pérfil que se esta viendo
    return new Promise((resolve,reject)=>{
        let transactionValue=baseDatos.transaction("profiles-pets","readwrite");
        let objetStore=transactionValue.objectStore("profiles-pets");
        let cursor=objetStore.openCursor();


        transactionValue.oncomplete=()=>{
            resolve();
        }

        transactionValue.onerror=()=>{
            reject("eso esta mal");
        }

        let cursorStopped=false;
    
        cursor.addEventListener("success",(e)=>{
            let puntero=e.target.result;
            if(puntero && !cursorStopped){
                let value2=puntero.value;
                if(value2.startProfile==true){
                    value2.startProfile = false; // Modificar la propiedad inicio a true
                    puntero.update(value2);
                    cursorStopped=true;
                }
                puntero.continue();
            }
        });
    });
}

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


// _________________________________________________

// const seeActivePet=()=>{
    
//     let transactionValue=baseDatos.transaction("profiles-pets");
//     let objectStore=transactionValue.objectStore("profiles-pets");
//     let cursor =objectStore.openCursor();

//     cursor.addEventListener("success",(e)=>{
//         let puntero=e.target.result;
//         if(puntero){
//             if(puntero.value.startProfile==true){

//                 let idOwnerPet=puntero.value.idOwnerPet;
//                 let age=puntero.value.age;
//                 let namePet=puntero.value.name;
//                 showClinicalHistoryInScreen(idOwnerPet,age,namePet);
//             }
//             puntero.continue();
//         }
//     });
// }



// _________________________________________________


const update=(namePet,idOwner)=>{
    return new Promise((resolve,reject)=>{
        let transaction=baseDatos.transaction("profiles-pets","readwrite");
        let objectStore=transaction.objectStore("profiles-pets");
        let cursor=objectStore.openCursor();

        cursor.onsuccess=(e)=>{
            let puntero=e.target.result;
            if(puntero){
                if(puntero.value.name==namePet && puntero.value.idOwner==idOwner){
                    
                }
            }
        }
    });
}




// _________________________________________________


// const pets=[];
// const identifyOtherPets=(idOwner)=>{
//    return new Promise((resolve,reject)=>{
//     let containerOtherPets=document.querySelector(".petsSameOwnerChild");
//     let transactionFalse=baseDatos.transaction("profiles-pets");
//     let objectStore=transactionFalse.objectStore("profiles-pets");
//     let cursor=objectStore.openCursor();
//     let mostrado=0;
//     cursor.addEventListener("success",(e)=>{
//         let puntero=e.target.result;
//         if(puntero){
//             if(puntero.value.idOwnerPet==idOwner){
//                 const resultHTML= `<div class="carta">
                
//                 <img src="/img/png-clipart-dog-paw-silhouette-dog-animals-paw.png" class="sinFace">

//                 <div class='${puntero.value.idOwnerPet}  carta2'>
//                 <p><strong>Nombre:</strong>
//                 <input value='${puntero.value.name}' class="valor" disabled></p><br>

//                 <p><strong>Documento:</strong>
//                 <input value='${puntero.value.idOwnerPet}' class="valor" disabled></p><br>

//                 <p><strong>Nombre del acudiente:</strong>
//                 <input value='${puntero.value.ownerName}' class="valor" disabled></p><br>
//                 `;
//                 mostrado++;

//                 pets.push(resultHTML);
//             }
//             puntero.continue();
//         }
//         else if(mostrado==0){
//             reject();
//         }
//         else{
//             resolve(pets.reverse());
//         }
    
//     });

//    });

// }