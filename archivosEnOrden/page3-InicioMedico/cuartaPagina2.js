


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


let containerWelcom=document.querySelector(".container");

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

let viewContainerSearch=document.querySelector(".containerSearchPatients");


let containerMistakes=document.querySelector(".mistakes");


let iconSearch=document.querySelector(".ri-search-line");

//Eventos y demas cosas que involucren la base de datos


let solicitud=indexedDB.open("datos");
var baseDatos;
solicitud.onsuccess=function(){
    
    
    baseDatos=solicitud.result;
    
    console.log("todo bien");
    
    validateloginUser()  //Activamos funcion para extraer del medico:nombre,id,correo,Numero nit 
    .then((information)=>{  //information equivale a todo lo antes dichos envuelto en una array
        
        extractNameVeterinary(information[3]) //information con esa posicion equivale al nit 
        
        .then((nameVeterinary)=>{ //Una vez resulta la funcion anterior como tambien es una promesa la activamos y devolvemos en resolve el nombre de la veterinaria
            
            let element=document.createElement("H1");
            element.classList.add("balance");
            element.innerHTML=`Perteneciente a Veterinaria: ${nameVeterinary}`;
            containerWelcom.appendChild(element);
            
            containerInformation.innerHTML+=`
            <ul>
            <li><strong>Nombre : </strong>${information[0]}</li>
            <li><strong>Correo asignado:</strong>${information[1]}</li>
            <li><strong>password Asignada : </strong>${information[2]}</li>
            </ul>`
        })
        
        .catch((e)=>{console.log(e);});
    })
    .catch((error)=>{
        if(error instanceof EmailNotFound){
            console.log(error.message);
        }
    })
    
    //Evento para cuando cierren sesion desactivar el perfil
    
    exit.addEventListener("click",(e)=>{
        changeStartedSessionValue()
        .then(()=>{
            window.location.replace("/page2-registromMedicos/terceraPagina2.html");
        }).catch((err)=>{
            alert("ocurrio un error");
        })
    });
    
   
    
    
   
    obtainMedicalId()
    
    .then((id)=>{
        let boleana=false;
        containerPatients.classList.toggle("ocultar");
        showPatients(id);
        viewReallyProfiles.addEventListener("click",(e)=>{
            if(!boleana){
                containerPatients.classList.toggle("ocultar");
                viewContainerSearch.classList.toggle("viewContainerSearch");
                document.querySelector(".goSearch").click();
                boleana=true
            }
            else{
                containerPatients.classList.toggle("ocultar");
                viewContainerSearch.classList.toggle("viewContainerSearch");
                boleana=false
            }
        });
    
    })
    .catch((e)=>{console.log(e.message);})  //mostramos cualquier error e consola
    


containerPatients.addEventListener("click",(e)=>{
    if(e.target.tagName!=="INPUT"){
        getSelectedLetterData(e);
    }
  
});



                //Go do verificacion for create new patients
    
 obtainMedicalId()   //Debimos hacerlos con promesas ya que simplemente llaman la funcion y obtener el valor que es el nit , no se puede
 .then((medicalId)=>{     
     buttonOfCreateProfiles.addEventListener("click",(e)=>{
         e.preventDefault();
         validateId()
         .then(()=>{ 
            validateOtherData(medicalId);
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
    console.log("malo malo");
    //  alert(e);
 })


 iconSearch.addEventListener("click",(e)=>{
    showSearch();
 });
 

}

//Pequeño evento





// ___________________________________________________________________________________________________________________

//INICIO DE FUNCIONES


 const validateloginUser=()=>{
    return new Promise((resolve,reject)=>{
        let transaccionFalse=baseDatos.transaction("medical-profiles");
        let objectStore=transaccionFalse.objectStore("medical-profiles");

        let cursor=objectStore.openCursor();

        cursor.addEventListener("success",(e)=>{
            let puntero= e.target.result;
            if(puntero){
                if(puntero.value.start==true){
                    resolve([puntero.value.name,puntero.value.email,puntero.value.password,puntero.value.nitVete]);
                }
                puntero.continue();
            }
            else{
            reject(new notFoundId("no se ecnotro el correo"));

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
    let name=document.querySelector(".name").value;
    let name2=document.querySelector(".ownerName").value;
    let id=document.querySelector(".id").value;     //Recogemos todos los valores ingresados
    let password=document.querySelector(".password").value;
    let specie=document.querySelector(".specie").value;
    let raza=document.querySelector(".raza").value;

    //Incio de la transaccionFalse para agregar datos al almacen de medical-profiles
    let transaccionFalse=baseDatos.transaction("profiles-pets","readwrite");
    let objectStore=transaccionFalse.objectStore("profiles-pets");

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
        startProfile:false
    })

    let name3=document.querySelector(".name").value="";
    let name4=document.querySelector(".ownerName").value="";
    let id2=document.querySelector(".id").value="";     // cambiamos el valor de todos a nada para      confirmar que estos datos se han añadido a la base de datos correctamente
    let specie2=document.querySelector(".specie").value="";
    let raza2=document.querySelector(".raza").value="";
    let telephone=document.querySelector(".telephone").value="";
    let password2=document.querySelector(".password").value="";
    location.reload();
   
}

// _________________________________________________________








 const getSelectedLetterData=(e)=>{
    let evento=e.target;
   
    let children=evento.childNodes; //Recogemos los nodos children del cotnainer
    console.log(children);
    let children2=children[3]; //una vez recogidos agarramos el primer nodo hijo
    

    let array1=children2.className.split(" ");// obtenemos las clases de ese nodo hijo y creamos un pequeño array con las clases que se supone que la primera es la id del dueño del animal

    activateProfileToViewClinicalHistory(array1[0]); //mandamos como parametro el primero element del array que se supone que es la id del dueño
}


// _________________________________________________________






const activateProfileToViewClinicalHistory=(idOwner)=>{ 
    let transaccionFalse=baseDatos.transaction("profiles-pets","readwrite");
    let objectStore=transaccionFalse.objectStore("profiles-pets");
    let cursor=objectStore.openCursor();
                                                //inicamos la transaccionFalse y abriendo el almacen de profiles perros


    cursor.addEventListener("success",(e)=>{        //inicamos el cursor para que capte cada element reocorrido
        let puntero=e.target.result;
        if(puntero){
            let valor=puntero.value;
            if(puntero.value.idOwnerPet==idOwner){//Cunado la id recorrida en el almacen de profiles perros conincida con la id que tenemos como parametro hacemos lo siguiente.

                
                valor.startProfile=true;  //Cambiamos el valor de inicio a true para que la pagina a la que va hacer redirijido el usuario capte esete valor diferente y sepa a cual perfil seleccionaron

                puntero.update(valor); //Agregamos el valor modificado

                 window.location.replace("/page4/quintaPagina.html"); //Redirijimos a otro pagina con la clase window para que no pueda darle la flecha de regresar si no que tenga que darle a otra opcion de la pagina para volview a esta pagina
            }
            puntero.continue();
        }
    });

}

// _____________________________________________________





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

                    <input type="button" onclick="deletePatient('${puntero.value.fecha}')" value="borrar"></div>
                    </div>     
                    `;
                    mostrado++;
                }
                puntero.continue();
        }
        else if(mostrado==0){
            containerPatients.innerHTML=`<h1 class="grande"> Aun no has creado Ningun Perfil</h1>`  
        } 

    });
}


// _________________________________________________________

const deletePatient=(key)=>{   //Esta funcion es la encargada de eliminar los pacientes
   
    let transaccionFalse=baseDatos.transaction("profiles-pets","readwrite");
    let objectStore=transaccionFalse.objectStore("profiles-pets");
    let eliminar=objectStore.delete(key);
}



// _________________________________________________________




// Functions for verification of data


const validateId=()=>{

    return new Promise((resolve,reject)=>{

    let id=document.querySelector(".id").value;
  
    let containNumber=false;
    for(x of id){
        if(isNaN(x)){
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
    let specie=document.querySelector(".specie").value;
    let raza=document.querySelector(".raza").value;
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
                for(x of phone){
                    if(isNaN(x)){
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
                        addPetsInDateBase(idDoctor)
                    }
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
    
    let quantityNumbers=0;
    let mayusculas=0;
    for(x of password){
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



                                    //EVENTOS




containerPatients.addEventListener("click",(e)=>{
    let evento=e.target;
    if(evento.tagName=="INPUT"){
        location.reload();
    }
});

// ________________________________


//Pequeño evento para desplegar el formulario para create un nuevo vet


createVet.addEventListener("click",(e)=>{
    containerProfiles.classList.toggle("viewForm"); //al contenedor con display none le damos una nuevo clase
});


equis.addEventListener("click",(e)=>{
    containerProfiles.classList.toggle("viewForm");
});



// ________________________________

let boolena=false;  //iniciamos una varibale boleana
    
viewProfiles.addEventListener("click",(e)=>{
    e.preventDefault();
    if(!boolena){
        optionsNav.classList.add("viewOptions");
        
        boolena=true;   //cambiamos el valor boleano de la variable para forzar el otro estado
    }
    else{
        optionsNav.classList.remove("viewOptions");

        boolena=false;
    }
    
});



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
            containerPatients.innerHTML= `<div class="carta">
                
                    <img src="/img/png-clipart-dog-paw-silhouette-dog-animals-paw.png" class="sinFace">

                    <div class='${puntero.value.idOwnerPet}  carta2'>
                    <p><strong>Nombre:</strong>
                    <input value='${puntero.value.name}' class="valor" disabled></p><br>

                    <p><strong>Documento:</strong>
                    <input value='${puntero.value.idOwnerPet}' class="valor" disabled></p><br>

                    <p><strong>Nombre del acudiente:</strong>
                    <input value='${puntero.value.ownerName}' class="valor" disabled></p><br>

                    <input type="button" onclick="deletePatient('${puntero.value.fecha}')" value="borrar"></div>
                    </div>     
         `;
        }
        else{
            containerPatients.innerHTML=`<h1>No existe ningun paciente con esa cedula</h1>`
        }
    });
}

