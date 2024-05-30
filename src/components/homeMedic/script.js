// page header and footer script
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


import{
    getUrlParams
}
from "/services/servicesMedic.js"


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

let containerProfiles=document.querySelector(".containerCreateProfiles"); //formulario desplegable para create nuevo veterinaria

let containerPatients=document.querySelector(".containerPatients");//container donde se mostraran sus profiles

let createVet=document.querySelector(".create"); // bottom de create profiles

let equis=document.querySelector(".equis");

let buttonOfCreateProfiles=document.querySelector(".createProfile");

let viewProfiles=document.querySelector(".viewProfiles"); //bottom para view profiles


let optionsNav=document.querySelector(".containerOptions");


let viewReallyProfiles=document.querySelector(".patients");



let containerMistakes=document.querySelector(".mistakes");


let iconSearch=document.querySelector(".ri-search-line");

let changePhoto=document.querySelector(".photo");

let containerPhoto=document.querySelector(".containerPhoto");

let inputPhoto=document.querySelector(".inputPhoto");

let containerReload=document.querySelector(".containerReload");

let footer=document.querySelector(".footer");

//__________________________________________________

//Eventos y demas cosas que involucren la base de datos

let solicitud=indexedDB.open("datos");
var baseDatos;
solicitud.onsuccess=function(){
    baseDatos=solicitud.result;
    
    console.log("todo bien");


//_________________________________________

    
    showPhotoInContainer()
        .then((url)=>{
            containerPhoto.innerHTML=`<img src='${url}'  class="show" alt='Poner una foto'>`;
        })
        .catch((err)=>{alert(err);});


    //______________________________________________
    
    validateloginUser()  //Activamos funcion para extraer del medico:nombre,id,correo,Numero nit 
    .then((information)=>{  //information equivale a todo lo antes dichos envuelto en una array
  
    })
    .catch(()=>{});

    //______________________________________________


    //Evento para cuando cierren sesion desactivar el perfil
    
    exit.addEventListener("click",(e)=>{
        window.location.replace("/src/components/accessPage/index.html");
    });
    
   
    //______________________________________________
    
    
   
    obtainMedicalId()
    
    .then((id)=>{
        
        showPatients(id);
        viewReallyProfiles.addEventListener("click",(e)=>{
            document.querySelector(".goSearch").click();

        });
    
    })
    .catch((e)=>{console.log(e.message);})  //mostramos cualquier error e consola
    
    //______________________________________________


containerPatients.addEventListener("click",(e)=>{
    if(e.target.tagName=="INPUT"){
        let clave=e.target.className;
        let claveNumerica=parseInt(clave);
        deletePatient(claveNumerica)
        .then(()=>{
            location.reload();
        })
        .catch()
    }

    else{
        let classElement =getSelectedLetterData(e);
        activateProfileToViewClinicalHistory(classElement) //mandamos como parametro el primero element del array que se supone que es la id del dueño
        .then((data)=>{
            window.location.replace("/src/components/viewPetDoctor/index.html?medic="+data[1]+"&Pet="+data[0]); //Redirijimos a otro pagina con la clase window para que no pueda darle la flecha de regresar si no que tenga que darle a otra opcion de la pagina para volview a esta pagina
        })
        .catch((err)=>{
            console.log(err);
        })
        }
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

  



//_______________________________________________________________


                //Go do verificacion for create new patients
    
 obtainMedicalId()   //Debimos hacerlos con promesas ya que simplemente llaman la funcion y obtener el valor que es el nit , no se puede
 .then((medicalId)=>{     
     buttonOfCreateProfiles.addEventListener("click",(e)=>{
         e.preventDefault();

         validateId()
         .then(()=>{ 
            let password=validateOtherData(medicalId);
            if(password==null){
            
            }
            else{
                validatePassword(password)
                .then(()=>{

                addPetsInDateBase(medicalId)

                .then(()=>{
                    location.reload();
                })
                .catch(()=>{
                    alert("errr");
                });

                
            })
            .catch((e)=>{
                containerMistakes.innerHTML=e.message;
            setTimeout(()=>{
                containerMistakes.innerHTML="";
            },4000)

            });
            }
        })
        .catch((e)=>{
            containerMistakes.innerHTML=e.message;
            setTimeout(()=>{
                containerMistakes.innerHTML="";
            },4000)
        })

     })
 })
 .catch((e)=>{
    console.log(e);
    //  alert(e);
 })
//__________________________________________________


 iconSearch.addEventListener("click",(e)=>{
    showSearch();
    containerReload.classList.add("viewReload");
    containerReload.addEventListener("click",()=>{
        location.reload();
    });
 });


//  _________________________________________

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










// ___________________________________________________________________________________________________________________

//INICIO DE FUNCIONES


 const validateloginUser=()=>{
    return new Promise((resolve,reject)=>{
            getUrlParams()
              .then((id) => {
                let transaction = baseDatos.transaction("medical-profiles");
                let objectStore = transaction.objectStore("medical-profiles");
                let cursor = objectStore.openCursor();
        
                cursor.onsuccess = (e) => {
                  let puntero = e.target.result;
                  if (puntero) {
                    if (puntero.key == id) {
                      let value = puntero.value;
                      document.querySelector("#Name").innerHTML = puntero.value.name;
                      document.querySelector("#Specialty").innerHTML = puntero.value.specialtyDoctor;
                      document.querySelector("#city").innerHTML = puntero.value.city;
                      document.querySelector("#email").innerHTML = puntero.value.email;
                      document.querySelector("#medicalCenter").innerHTML = puntero.value.medicalCenter;

                      document.querySelector("#updateName").value = puntero.value.name;
                      document.querySelector("#updateSpecialty").value = puntero.value.specialtyDoctor;
                      document.querySelector("#updateCity").value = puntero.value.city;
                      document.querySelector("#updateEmail").value = puntero.value.email;
                      document.querySelector("#updateMedicalCenter").value = puntero.value.medicalCenter;
                    
                      resolve();
                    }
                    puntero.continue();
                  } 
                }   
            })

            .catch();
    });
}


// _________________________________________________________


const obtainMedicalId=()=>{
    return new Promise((resolve,reject)=>{
    getUrlParams()

    .then((id)=>{
        let transaccionFalse=baseDatos.transaction("medical-profiles");
        let objectStore=transaccionFalse.objectStore("medical-profiles");
        let cursor=objectStore.openCursor();
        cursor.addEventListener("success",(e)=>{
            let puntero=e.target.result;
            if(puntero){
                if(puntero.key==id){
                    resolve(puntero.value.id);
                }
                puntero.continue();
            }
            else{
                reject(new notFoundId("no hay ninguna id activa"));
            }
    });


    })
    .catch();
  });
}


// _________________________________________________________



 const addPetsInDateBase=(medicalIdInCharge)=>{ /*Funcion para meter nuevos profiles vets a la base de datos*/
 return new Promise((resolve, reject) => {
    let name=document.querySelector(".name").value;
    let name2=document.querySelector(".ownerName").value;
    let id=document.querySelector(".id").value;     //Recogemos todos los valores ingresados
    let password=document.querySelector(".password").value;
    let specie=document.querySelector(".specie").value;
    let raza=document.querySelector(".raza").value;
    let agePet=document.querySelector(".age").value;
    let address=document.querySelector(".address").value;
    let phone=document.querySelector(".telephone").value;

    //Incio de la transaccionFalse para agregar datos al almacen de medical-profiles
    let transaccionFalse=baseDatos.transaction("profiles-pets","readwrite");
    let objectStore=transaccionFalse.objectStore("profiles-pets");

    transaccionFalse.oncomplete=()=>{
        resolve();
    }

    transaccionFalse.onerror=()=>{
        reject();
    }

    objectStore.add({
        name:name,
        ownerName:name2,
        idOwnerPet:id,
                                              //Agregamos todos los datos ingresados en el formulario de create nuevo doctor
        specie:specie,
        age:agePet,
        directionHouse:address,
        passwordPet:password,
        ownerPhone:phone,
        raza:raza,
        medicalIdInCharge:medicalIdInCharge,
        startProfile:false,
        urlPhotoPets:""
    })

    let name3=document.querySelector(".name").value="";
    let name4=document.querySelector(".ownerName").value="";
    let id2=document.querySelector(".id").value="";     // cambiamos el valor de todos a nada para      confirmar que estos datos se han añadido a la base de datos correctamente
    let specie2=document.querySelector(".specie").value="";
    let raza2=document.querySelector(".raza").value="";
    let telephone=document.querySelector(".telephone").value="";
    let password2=document.querySelector(".password").value="";
 }) 
}

// _________________________________________________________



 const getSelectedLetterData=(e)=>{
    let evento=e.target;
   
    let children=evento.childNodes; //Recogemos los nodos children del cotnainer
    let children2=children[3]; //una vez recogidos agarramos el primer nodo hijo
    console.log(children2);
    

    let array1=children2.className.split(" ");// obtenemos las clases de ese nodo hijo y creamos un pequeño array con las clases que se supone que la primera es la id del dueño del animal

    return array1[0];
}


// _________________________________________________________



const activateProfileToViewClinicalHistory = (idOwner) => {
    return new Promise((resolve, reject) => {
        getUrlParams()
        .then((id)=>{
            let transaccionFalse = baseDatos.transaction("profiles-pets",);
            let objectStore = transaccionFalse.objectStore("profiles-pets");
            let cursor = objectStore.openCursor();


            cursor.addEventListener("success", (e) => {
                let puntero = e.target.result;
                if (puntero) {
                    let value = puntero.value;
                    if (value.idOwnerPet==idOwner) { 
                        // La transacción se completó, resolvemos la promesa
                        resolve([puntero.key,id]);
                        // devolvemos en la promesa el id unico del animal y el valor unico del medico
                    } 
                    puntero.continue();
                } 
                else {
                    // Cuando no hay más datos en el cursor, la transacción se completará automáticamente
                }
            });

        })
        .catch();
      });
}

// _____________________________________________________


const deletePatient=(id)=>{ //Recibimos id para elejir elemento a eliminar
    return new Promise((resolve,reject)=>{
        let transaction=baseDatos.transaction("profiles-pets","readwrite");
        let objectStore=transaction.objectStore("profiles-pets");
        objectStore.delete(id);
        transaction.oncomplete=()=>{
            resolve();
        }
    });
}


//funcion para mostrar en pantalla los paceintes actuales del doctor
const showPatients=(idvet)=>{ //Esta funcion se encarga de mostrar los medicos asociados a una veterinaria en la pantalla , y el medio de identificacion para saber cual medico es de una veterinaria es el NIT
    let transaccionFalse=baseDatos.transaction("profiles-pets");  //abrimos el almacen de medical-profiles
    let objectStore=transaccionFalse.objectStore("profiles-pets");
    let cursor=objectStore.openCursor();    //Abrimos el cursor para recorrer cada dato
     // Funcion que devuelve el nit le da veterinaria activa
     let mostrado=0;
    let containerPatients=document.querySelector(".containerPatients");//container donde se mostraran sus profiles

    cursor.addEventListener("success",(e)=>{
        let puntero=e.target.result;
        if(puntero){
            if(puntero.value.medicalIdInCharge===idvet){
                    containerPatients.innerHTML+= `<div class="carta">
                
                    <img src='${puntero.value.urlPhotoPets}' alt="Sin foto" class="sinFace">

                    <div class='${puntero.value.idOwnerPet}  carta2'>
                    <p><strong>Nombre:</strong>
                    <input value='${puntero.value.name}' class="valor" disabled></p><br>

                    <p><strong>Documento:</strong>
                    <input value='${puntero.value.idOwnerPet}' class="valor" disabled></p><br>

                    <p><strong>Nombre del acudiente:</strong>
                    <input value='${puntero.value.ownerName}' class="valor" disabled></p><br>

                    <input type="button" class="${puntero.key}" id="deleteButton" value="borrar"></div>
                    </div>     
                    `;
                    mostrado++;
                }
                puntero.continue();
        }
        else if(mostrado==0){
            containerPatients.innerHTML=`<h1 class="textBig"> Aun no has creado Ningun Perfil</h1>`  
        } 

    });

    
}


// _________________________________________________________




// _________________________________________________________




// Functions for verification of data


const validateId=()=>{

    return new Promise((resolve,reject)=>{

    let id=document.querySelector(".id").value;
  
    let containNumber=false;
    for(let p of id){
        if(isNaN(p)){
            containNumber=true;
        }
    }
    
    if(id.length<=9 || id.length>10 || containNumber){
        reject(new rangeId("En la cedula pon la cantidad de numeros correctamnete y ninguna letra"));
    }
    else{
        
        let transaccion=baseDatos.transaction("profiles-pets");
        let openStore=transaccion.objectStore("profiles-pets");
        let cursor =openStore.openCursor();
        
        cursor.addEventListener("success",(e)=>{
            let puntero=e.target.result;
            if(puntero){
                if(puntero.value.idOwnerPet==id){
                  let pregunta=confirm("Esta cedula ya esta asociado a un animal , quieres asociar otro animal a esta misma cedula?");
                  if(pregunta){

                }
                else{
                    reject(new duplicateId("pon otra cedula por favor"));
                }
            }
            puntero.continue();
        }
        resolve();
        });
    }

    
    });
    
}


// _________________________________________________________



const validateOtherData=()=>{
    let namePet=document.querySelector(".name").value;
    let nameOwner=document.querySelector(".ownerName").value;
    let phone=document.querySelector(".telephone").value;
    let passwordPet=document.querySelector(".password").value;

    try{
        if(namePet.length<2){
            throw new completeName("Pon un nombre con mas caracteres");
        }
        else{
            if(nameOwner<2){

                throw new completeName("Pon nombre del acudinte corrrectamente");
            }
            else{          

                let containNumber=false;
                for(let p of phone){
                    if(isNaN(p)){
                        containNumber=true;
                    }
                }

                if(phone.length<=9 || phone.length>10 || containNumber){
                    throw new invalidPhone("Numero celular incorrecto");
                }

                else{
                    return passwordPet;
                }
                            
            }
        }
    }
    catch(error){
        containerMistakes.innerHTML=error.message;
        setTimeout(()=>{
            containerMistakes.innerHTML="";
        },3000);
    }

}



const validatePassword=(password)=>{
    return new Promise((resolve,reject)=>{

    let quantityNumbers=0;
    let mayusculas=0;
    for(let x of password){
        let conversion=parseInt(x);
        if(x == x.toUpperCase() && isNaN(conversion)){
            mayusculas++;
        }
        else if(!isNaN(conversion)){
            quantityNumbers++;
        }
    }

    if(mayusculas >= 1 && quantityNumbers >2){
        resolve();
    }
    else{
        reject(new improvePassword("La contraseña debe contener una mayuscula y minimo 3 numeros"));
    }
    });
}



const changeUrlPhoto=(url)=>{
    return new Promise((resolve,reject)=>{
        getUrlParams()
        .then((id)=>{
            let transaction=baseDatos.transaction("medical-profiles","readwrite");
            let objectStore=transaction.objectStore("medical-profiles");
            let cursor=objectStore.openCursor();

            transaction.oncomplete=()=>{
                resolve();
            }
            transaction.onerror=()=>{
                reject("No se pudo cambiar la foto de perfil");
            }

            let cursorStopped=false;

            cursor.onsuccess=(e)=>{
                let puntero=e.target.result;
                if(puntero && !cursorStopped){
                    if(puntero.key==id){
                        let valueChange=puntero.value;

                        valueChange.urlPhotoDoctor=url;
                        puntero.update(valueChange);
                        cursorStopped=true;
                    }
                    puntero.continue();
                }
            }
        })
        .catch();
    });
}



//______________________________________________


const showPhotoInContainer=()=>{
    return new Promise((resolve,reject)=>{
       getUrlParams()
       .then((id)=>{
        let transaction=baseDatos.transaction("medical-profiles");
        let objectStore=transaction.objectStore("medical-profiles");
        let cursor=objectStore.openCursor();

        cursor.onsuccess=(e)=>{
            let puntero=e.target.result;
            if(puntero){
                if(puntero.key==id){
                    resolve(puntero.value.urlPhotoDoctor);
                }
                puntero.continue();
            }
            else{
                reject("no hay ninguna url");
            }
        }
       })

       .catch();
    });
}

// ________________________________


const showSearch=()=>{
    let valueSearch=document.querySelector(".searchPatients").value;
    let transactionFalse=baseDatos.transaction("profiles-pets");
    let objectStore=transactionFalse.objectStore("profiles-pets");
    let index=objectStore.index("idOwnerPetIndex");
    let range=IDBKeyRange.only(valueSearch);
    let cursor=index.openCursor(range);


    cursor.addEventListener("success",(e)=>{
        let puntero=e.target.result;
        if(puntero){
            // containerPatients.classList.toggle("viewContainer");
            containerPatients.innerHTML= `<div class="carta">
                
                    <img src="${puntero.value.urlPhotoPets}" class="sinFace">

                    <div class='${puntero.value.idOwnerPet}  carta2'>
                    <p><strong>Nombre:</strong>
                    <input value='${puntero.value.name}' class="valor" disabled></p><br>

                    <p><strong>Documento Asociado :</strong>
                    <input value='${puntero.value.idOwnerPet}' class="valor" disabled></p><br>

                    <p><strong>Nombre del acudiente:</strong>
                    <input value='${puntero.value.ownerName}' class="valor" disabled></p><br>

                    <input type="button" onclick="" value="borrar"></div>
                    </div>     
         `;
        }
        else{
            containerPatients.innerHTML=`<h1>No existe ningun paciente con esa cedula</h1>`
        }
    });
}

//__________________________________________________



const updateData = () => {
    return new Promise((resolve, reject) => {
        getUrlParams()
        .then((id) => {
          let name = document.querySelector("#updateName").value;
          let specialty = document.querySelector("#updateSpecialty").value;
          let city = document.querySelector("#updateCity").value;
          let email = document.querySelector("#updateEmail").value;
          let clinic = document.querySelector("#updateMedicalCenter").value;
  
          let transaction = baseDatos.transaction("medical-profiles", "readwrite");
          let openStore = transaction.objectStore("medical-profiles");
  
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
                value2.specialtyDoctor = specialty;
                value2.city = city;
                value2.email = email;
                value2.medicalCenter = clinic;
                
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


//__________________________________________________


const readFile=(image)=>{
    return new Promise((resolve,reject)=>{
        const reader=new FileReader();
        reader.readAsDataURL(image);

        reader.addEventListener("load",(e)=>{
            resolve(e.target.result);
        });
    });
}

//__________________________________________________


//EVENTOS


//Pequeño evento para desplegar el formulario para create un nuevo vet


createVet.addEventListener("click",(e)=>{
    containerPatients.classList.toggle("hideText");
    optionsNav.classList.remove("viewOptions");
    footer.classList.toggle("downFooter");
    containerProfiles.classList.toggle("viewForm"); //al contenedor con display none le damos una nuevo clase
});


equis.addEventListener("click",(e)=>{
    containerProfiles.classList.toggle("viewForm");
    containerPatients.classList.toggle("hideText");

});

    
viewProfiles.addEventListener("click",(e)=>{
    e.preventDefault();
    optionsNav.classList.toggle("viewOptions");
    containerProfiles.classList.remove("viewForm");
});



changePhoto.addEventListener("click",(e)=>{
    inputPhoto.click();
});



containerPhoto.addEventListener("click",(e)=>{
    inputPhoto.click();

});


//__________________________________________________


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

