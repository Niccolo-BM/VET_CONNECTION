// import{
//     changeValueEntity
// }
// from "/services/servicesMedic.js"


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
//Eventos y demas cosas que involucren la base de datos


let solicitud=indexedDB.open("datos");
var baseDatos;
solicitud.onsuccess=function(){
    baseDatos=solicitud.result;
    
    console.log("todo bien");

    // dataDoctor();

//_________________________________________

    
    showPhotoInContainer()
        .then((url)=>{
            containerPhoto.innerHTML=`<img src='${url}'  class="show" alt='Poner una foto'>`;
        })
        .catch((err)=>{alert(err);});


    //______________________________________________
    
    validateloginUser()  //Activamos funcion para extraer del medico:nombre,id,correo,Numero nit 
    .then((information)=>{  //information equivale a todo lo antes dichos envuelto en una array
        alert("escrie");
        containerInformation.innerHTML+=`
        <ul>
        <li><strong>Nombre : </strong>${information[0]}</li>
        <li><strong>Correo asignado:</strong>${information[1]}</li>
        <li><strong>password Asignada : </strong>${information[2]}</li>
        </ul>`
        
    })
    .catch(()=>{});
    
    // extractNameVeterinary(information[3]) //information con esa posicion equivale al nit 
    // .catch((error)=>{
    //     if(error instanceof EmailNotFound){
    //         console.log(error.message);
    //     }
    // })
    

    //______________________________________________


    //Evento para cuando cierren sesion desactivar el perfil
    
    exit.addEventListener("click",(e)=>{
        changeStartedSessionValue()
        .then(()=>{
            window.location.replace("/src/components/accessPage/index.html");
        }).catch((err)=>{
            alert(err);
        })
    });
    
   
    //______________________________________________
    
    
   
    obtainMedicalId()
    
    .then((id)=>{
        containerPatients.classList.add("viewContainer");
        
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
            alert("resolvimos");
            location.reload();
        })
        .catch()
    }

    else{
        let classElement =getSelectedLetterData(e);
        activateProfileToViewClinicalHistory(classElement) //mandamos como parametro el primero element del array que se supone que es la id del dueño
        .then(()=>{
            window.location.replace("/src/components/"); //Redirijimos a otro pagina con la clase window para que no pueda darle la flecha de regresar si no que tenga que darle a otra opcion de la pagina para volview a esta pagina
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
            let idDoctor=validateOtherData(medicalId);
            addPetsInDateBase(idDoctor)
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
        })

     })
 })
 .catch((e)=>{
    console.log(e);
    //  alert(e);
 })


 iconSearch.addEventListener("click",(e)=>{
    showSearch();
    containerReload.classList.add("viewReload");
    containerReload.addEventListener("click",()=>{
        location.reload();
    });
 });
 

}










// ___________________________________________________________________________________________________________________

//INICIO DE FUNCIONES


 const validateloginUser=()=>{
    return new Promise((resolve,reject)=>{
        let transaccionFalse=baseDatos.transaction("medical-profiles");
        let objectStore=transaccionFalse.objectStore("medical-profiles");

        let cursor=objectStore.openCursor();

        transaccionFalse.onerror=()=>{
            reject(new notFoundId("no se ecnotro el correo"));
    }
        cursor.addEventListener("success",(e)=>{
            let puntero= e.target.result;
            if(puntero){
                if(puntero.value.start==true){
                    let value2=puntero.value;
                    transaccionFalse.oncomplete=()=>{
                    resolve([value2.name,value2.email,value2.password,value2.nitVete]);
                    }
                }
                puntero.continue();
            }
        });
    });

 

}

// _________________________________________________________



const extractNameVeterinary=(nit)=>{
    return new Promise((resolve,reject)=>{
        let transaccionFalse=baseDatos.transaction("veterinarys");
        let objectStore=transaccionFalse.objectStore("veterinarys");
        let cursor=objectStore.openCursor();

        cursor.addEventListener("success",(e)=>{

            let puntero=e.target.result;
            if(puntero){

                if(puntero.value.veterinaryNit==nit){
                    resolve(puntero.value.veterinaryName);
                }
                puntero.continue();
            }
            else{
                reject("no se encontro ninguna veterinaria con ese NIT")
            }
        });
    });
}


// _________________________________________________________



const changeStartedSessionValue=()=>{
    return new Promise((resolve,reject)=>{
    let transaccionFalse=baseDatos.transaction("medical-profiles","readwrite");
    let objetStore=transaccionFalse.objectStore("medical-profiles");


    let cursor=objetStore.openCursor();

    cursor.addEventListener("success",(e)=>{
        let puntero=e.target.result;
        if(puntero){
            let valor=puntero.value;
            if(valor.start==true){
                valor.start = false; // Modificar la propiedad inicio a true
                puntero.update(valor); 
                resolve();
            }
            puntero.continue();
            }
            else{
            reject(new notFoundId("El correo no existe"));
        }
        
    });
    });
}


// _________________________________________________________




const obtainMedicalId=()=>{
    return new Promise((resolve,reject)=>{
    let transaccionFalse=baseDatos.transaction("medical-profiles");
    let objectStore=transaccionFalse.objectStore("medical-profiles");
    let cursor=objectStore.openCursor();
    cursor.addEventListener("success",(e)=>{
        let puntero=e.target.result;
        if(puntero){
            if(puntero.value.start==true){
                resolve(puntero.value.id);
            }
            puntero.continue();
        }
        else{
            reject(new notFoundId("no hay ninguna id activa"));
        }
    });
    })
    
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
        fecha:new Date().toISOString(),
        name:name,
        ownerName:name2,
        idOwnerPet:id,
                                              //Agregamos todos los datos ingresados en el formulario de create nuevo doctor
        specie:specie,
        passwordPet:password,
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
        let transaccionFalse = baseDatos.transaction("profiles-pets", "readwrite");
        let objectStore = transaccionFalse.objectStore("profiles-pets");
        let cursor = objectStore.openCursor();

        transaccionFalse.oncomplete = () => {
            // La transacción se completó, resolvemos la promesa
            resolve();
        };

        transaccionFalse.onerror = (event) => {
            // Si ocurre un error en la transacción, rechazamos la promesa
            reject(event.target.error);
        };

        let cursorStopped=false;

        cursor.addEventListener("success", (e) => {
            let puntero = e.target.result;
            if (puntero && !cursorStopped) {
                let value = puntero.value;
                if (puntero.value.idOwnerPet == idOwner && puntero.value.startProfile == false) {

                    value.startProfile = true; // Cambiamos el valor de inicio a true para que la página a la que va a ser redirigido el usuario capture este valor diferente y sepa a cuál perfil seleccionaron

                    // Actualizamos el objeto en el almacén de objetos
                    puntero.update(value);
                    cursorStopped=true;
                }
                else{
                    puntero.continue();
                }

            } else {
                // Cuando no hay más datos en el cursor, la transacción se completará automáticamente
            }
        });
    });
}

// _____________________________________________________


const deletePatient=(id)=>{ //Recibimos id para elejir elemento a eliminar
    return new Promise((resolve,reject)=>{
        let transaction=baseDatos.transaction("profiles-pets","readwrite");
        let objectStore=transaction.objectStore("profiles-pets");
        objectStore.delete(id);
        resolve();
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
                
                    <img src="/img/png-clipart-dog-paw-silhouette-dog-animals-paw.png" class="sinFace">

                    <div class='${puntero.value.idOwnerPet}  carta2'>
                    <p><strong>Nombre:</strong>
                    <input value='${puntero.value.name}' class="valor" disabled></p><br>

                    <p><strong>Documento:</strong>
                    <input value='${puntero.value.idOwnerPet}' class="valor" disabled></p><br>

                    <p><strong>Nombre del acudiente:</strong>
                    <input value='${puntero.value.ownerName}' class="valor" disabled></p><br>

                    <input type="button" class="${puntero.key}" value="borrar"></div>
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



const validateOtherData=(idDoctor)=>{
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
                    let valueValidate=validatePassword(passwordPet);

                    if(valueValidate==false){
                        throw new improvePassword("La contraseña debe tener minimo una mayuscula y 3 numeros");
                    }
                    else{
                        return idDoctor;
                    }
                }
                            
            }
        }
    }
    catch(error){
        console.log(error.message);
        containerMistakes.innerHTML=error.message;
        setTimeout(()=>{
            containerMistakes.innerHTML="";
        },3000);
    }

}



const validatePassword=(password)=>{
    
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
        return true;
    }
    else{
        return false;
    }
}



const changeUrlPhoto=(url)=>{
    return new Promise((resolve,reject)=>{
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
                if(puntero.value.start==true){
                    let valueChange=puntero.value;
                    valueChange.urlPhotoDoctor=url;
                    puntero.update(valueChange);
                    cursorStopped=true;
                }
                puntero.continue();
            }
        }
    });
}



//______________________________________________


const showPhotoInContainer=()=>{
    return new Promise((resolve,reject)=>{
        let transaction=baseDatos.transaction("medical-profiles");
        let objectStore=transaction.objectStore("medical-profiles");
        let cursor=objectStore.openCursor();

       


        cursor.onsuccess=(e)=>{
            let puntero=e.target.result;
            if(puntero){
                if(puntero.value.start==true){
                 resolve(puntero.value.urlPhotoDoctor);
                }
                puntero.continue();
            }
            else{
                reject("no hay ninguna url");
            }
        }
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
                
                    <img src="/img/png-clipart-dog-paw-silhouette-dog-animals-paw.png" class="sinFace">

                    <div class='${puntero.value.idOwnerPet}  carta2'>
                    <p><strong>Nombre:</strong>
                    <input value='${puntero.value.name}' class="valor" disabled></p><br>

                    <p><strong>Documento:</strong>
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




// const dataDoctor=()=>{
//     let transaccion=baseDatos.transaction("medical-profiles","readwrite");
//     let objectStore=transaccion.objectStore("medical-profiles");
//     objectStore.add({
//         clave : new Date().toISOString(),
//             name : "jhoatan",
//             id : "1020222769",
//             nitVete:"123456789",
//             email : "jhona@gmail.com",
//             password : "1020222769",
//             specialtyDoctor : "general",
//             city :"medellin",
//             start:true,
//             urlPhotoDoctor:''
//     });
// }