

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
let signOut=document.querySelector(".signOut");

let send=document.querySelector(".send");

let container=document.querySelector(".containerFeed");

let containerSecurity=document.querySelector(".containerSecurity");

let containerOverlay=document.querySelector(".containerOverlay");

let containerInformation=document.querySelector(".innerPart");

let createProfileAnimal=document.querySelector(".instanceProfile");

let title=document.querySelector(".quitar");




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


      
    validateloginUser()  //Activamos funcion para extraer del medico:nombre,id,correo,Numero nit 
    .then((information)=>{  //information equivale a todo lo antes dichos envuelto en una array
   
            containerInformation.innerHTML+=`
            <ul>
            <li><strong>Nombre : </strong>${information[0]}</li>
            <li><strong>telefono Acudiente:</strong>${information[1]}</li>
            <li><strong>nombre del acudiente : </strong>${information[2]}</li>
            </ul>`
    
    })
    .catch((error)=>{//Manejando posibles errores que puedan suceder
            console.log(error.message);
            alert(error.message);
       
    })
    


    validateloginUser()  //Volvemos a llamar a la funcion que identifica el perfil activo para sacar la cedula asociada
    .then((information)=>{
        alert("verificando");
        identifyOtherPets(information[1]);
    })
    .catch((e)=>{})


    send.addEventListener("click", (e) => {  //evento para cuando se cree una historia clinica regresar una ventana modal
        e.preventDefault();
        
      obtainDoctorID()

      .then(()=>{        
                containerSecurity.classList.toggle("returnModal");
                containerOverlay.classList.toggle("big");
                
                containerSecurity.addEventListener("click",(e)=>{
                    let evento=e.target;
                    if(evento.className=="aceptar"){
                                location.reload();       
                                uploaData();                  
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
;
    seeActivePet();


    //evento para cuando den cerrar sesion
    signOut.addEventListener("click",()=>{
        changeLoggedValue()
        .then(()=>{
            changePetValue();
            window.location.replace("/page2-registromMedicos/terceraPagina2.html");
        })
        .catch((e)=>{alert(e)});
    });
    title.addEventListener("click",changePetValue);//Este evento cambian el value2 del perfil iniciado por si quieren regresar

}


/*Event for show feedback*/ 

let textInitial=true;

container.addEventListener("click",(e)=>{   //Evento para tener diferentes estados para ver si se quiere ver o 
                                            // ocultar una historia clinica en particular
    let evento=e.target;
    let brother=evento.previousElementSibling;

    if(evento.className.includes("ver") && brother.className.includes("texto")&& textInitial){
        evento.innerHTML="Ocultar feedback";
        brother.classList.toggle("volver");
        textInitial=false
    }
    else if(evento.className.includes("ver") && brother.className.includes("texto")&& !textInitial){
        evento.innerHTML="Ver feedback";
        brother.classList.toggle("volver");
        textInitial=true;
    }
});

// End of this event


//INICIO DE FUNCIONES


 const validateloginUser=()=>{
    return new Promise((resolve,reject)=>{
        let transaccionFalse=baseDatos.transaction("profiles-pets");
        let objectStore=transaccionFalse.objectStore("profiles-pets");

        let cursor=objectStore.openCursor();

        cursor.addEventListener("success",(e)=>{
            let puntero= e.target.result;
            if(puntero){
                if(puntero.value.startProfile==true){
                    resolve([puntero.value.name,puntero.value.idOwnerPet,puntero.value.ownerName,puntero.value.ownerPhone]);
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


const obtainDoctorID=()=>{  //Funcion encargada de conseguir ceduldel dueño y cedula del animal y hacer otra funcion
    return new Promise((resolve,reject)=>{
        let transactionValue=baseDatos.transaction("profiles-pets");
        let objectStore=transactionValue.objectStore("profiles-pets");
        let cursor=objectStore.openCursor();
    
        cursor.addEventListener("success",(e)=>{
            let puntero=e.target.result;
            if(puntero){
                if(puntero.value.startProfile==true){
                   resolve(uploaData(puntero.value.idOwnerPet,puntero.value.medicalIdInCharge));
                }
                puntero.continue();
            }

            else{
                reject(new inicioNotFound("No se encontro ningun perfil activo"));
            }
        });
    
    });
   
}

const uploaData=(idOwnerPet,idDoctor)=>{      //Funcion encargada de subir los datos
        let description=document.querySelector(".description").value;
        let physical=document.querySelector(".physical").value;
        let diagnosis=document.querySelector(".diagnosis").value;
        let treatment=document.querySelector(".treatment").value;
        let medicalMotoring=document.querySelector(".follow-up").value;
        let comments=document.querySelector(".comments").value;


        let transactionValue=baseDatos.transaction("medical-history","readwrite");
        let openStore=transactionValue.objectStore("medical-history");

        openStore.add({
            id:new Date().toISOString(),
            descriptionPet:description,
            physicalExam:physical,
            diagnosisPet:diagnosis,
            treatmentPet:treatment,
            medicalMotoringPet:medicalMotoring,
            commentsPet:comments,
            idOwnerPet:idOwnerPet,
            idDoctorPet:idDoctor
        });

        let description2=document.querySelector(".description").value="";
        let physical2=document.querySelector(".physical").value="";
        let diagnosis2=document.querySelector(".diagnosis").value="";
        let treatment2=document.querySelector(".treatment").value="";
        let medicalMotoring2=document.querySelector(".follow-up").value="";
        let comments2=document.querySelector(".comments").value="";

    }





const showFeed=()=>{     //Funcion por el momento de uso desconocido
    return new Promise((resolve,reject)=>{
        let transactionValue=baseDatos.transaction("medical-history");
        let objectStore=transactionValue.objectStore("medical-history");
        let cursor=objectStore.openCursor();
        

        cursor.addEventListener("success",(e)=>{
            let puntero=e.target.result;
            if(puntero){
                if(puntero.value.cedulaAnimal==documentoAsociado){
                   showFeed2.innerHTML+=`<div class="salto" >`+ puntero.value.feed +  `<button class="ver">Ver Feedback</buttton> </div>`;
                }
                puntero.continue();
            }
            
        });
    });
}



const montarContainer=()=>{     //funcion por el momento de uso desconocido
    let transactionValue=baseDatos.transaction("medical-history");
    let almacen=transactionValue.objectStore("medical-history");
    let cursor=almacen.openCursor();

    cursor.addEventListener("success",(e)=>{
    
        let puntero=e.target.result;
        if(puntero){
            container.innerHTML+=`<div class="salto" >`+ puntero.value.info + puntero.value.feedBack + `<button class="ver">Ver Feedback</buttton> </div>`;
            puntero.continue();
        }
    });
}

// Funciones para mostrar animales que ya estan resgitrados en la base de datos

const mostrarAnimales=()=>{     //funcion de uso desconocido
    let mostrarDispoibles=document.querySelector(".contenido");
    return new Promise((resolve,reject)=>{
        let transactionValue=baseDatos.transaction("profiles-pets");
        let objectStore=transactionValue.objectStore("profiles-pets");
        let cursor=objectStore.openCursor();

        cursor.addEventListener("success",(e)=>{
            let puntero=e.target.result;
            if(puntero){
            puntero.continue();
            }
        });
    });
}



// Evento para cerrar sesion


const changeLoggedValue=()=>{  //Funcion para desactivar el pérfil que se esta viendo
    return new Promise((resolve,reject)=>{
        let transactionValue=baseDatos.transaction("medical-profiles","readwrite");
        let objetStore=transactionValue.objectStore("medical-profiles");
        let cursor=objetStore.openCursor();
    
        cursor.addEventListener("success",(e)=>{
            let puntero=e.target.result;
            if(puntero){
                let value2=puntero.value;
                if(value2.inicio==true){
                    value2.inicio = false; // Modificar la propiedad inicio a true
                    puntero.update(value2);
                    resolve();
                }
                puntero.continue();
            }
            else{
            reject("eso esta mal");
            }
        });
    });
}


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


const seeActivePet=()=>{
    
    let transactionValue=baseDatos.transaction("profiles-pets");
    let objectStore=transactionValue.objectStore("profiles-pets");
    let cursor =objectStore.openCursor();

    cursor.addEventListener("success",(e)=>{
        let puntero=e.target.result;
        if(puntero){
            if(puntero.value.startProfile==true){

                let idOwnerPet=puntero.value.idOwnerPet;
                let nombreAnimal=puntero.value.name;
                showClinicalHistoryInScreen(idOwnerPet,nombreAnimal);
            }
            puntero.continue();
        }
    });
}



// const addInfoClinicalHistory=()=>{}


const resultados=[];

const showClinicalHistoryInScreen=(idOwnerPet2,nombreAnimal)=>{
    let transactionValue=baseDatos.transaction("medical-history");
    let objectStore=transactionValue.objectStore("medical-history");
    let cursor=objectStore.openCursor();
    let objeto={};

    
    cursor.addEventListener("success",(e)=>{
        let puntero=e.target.result;
        if(puntero){
            if(puntero.value.idOwnerPet==idOwnerPet2){       
                container.classList.add("visualizarHistoriaClinica");
                let reloj=new Date();
                let fecha=`${reloj.getDate()} / ${reloj.getMonth()+1} / ${reloj.getFullYear()}`;
                let hora=`${reloj.getHours()}:${reloj.getMinutes()}`;
                const resultsHTML=`<div class="grid">
                <div class="containerHistoria">
                    <h2> Historia clinica </h2><br> 
                    <strong>description : <br></strong> ${puntero.value.descriptionPet} <br> <br>

                    <strong> exam physical : <br></strong> ${puntero.value.physicalExam} <br> <br>
                    <strong> diagnosis : <br></strong> ${puntero.value.diagnosisPet} <br> <br>
                    <strong> treatment : <br></strong> ${puntero.value.treatmentPet} <br> <br>
                    <strong> medicalMotoring : <br></strong> ${puntero.value.medicalMotoringPet} <br> <br>
                </div>

                <div class="containerComments">
                    <h2> comments</h2> <br> 
                    <p> ${puntero.value.commentsPet}</p>
                    </div>
                    </div>`
       
                resultados.push(resultsHTML);
            }
            puntero.continue();
        }
        else{
            container.innerHTML = resultados.reverse();
        }
    });

    
}


const changePetValue=()=>{
    let transactionValue=baseDatos.transaction("profiles-pets","readwrite");
    let objectStore=transactionValue.objectStore("profiles-pets");
    let cursor=objectStore.openCursor();

    cursor.addEventListener("success",(e)=>{
        let puntero=e.target.result;
        if(puntero){
            let value2=puntero.value;
            if(value2.startProfile==true){
                value2.startProfile=false;
                puntero.update(value2);
                window.location.replace("/page3-InicioMedico/cuartaPagina2.html");
            }
            puntero.continue();
        }
        else{
            console.log("ps nada");
        }
    });
}


const eliminarHisotriaClinica=()=>{
    let transactionValue=baseDatos.transaction("");
}





let viewProfiles=document.querySelector(".viewProfiles"); //bottom para view profiles
let optionsNav=document.querySelector(".containerOptions");



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



const identifyOtherPets=(idOwner)=>{
    let containerOtherPets=document.querySelector(".petsSameOwnerChild");
    let transactionFalse=baseDatos.transaction("profiles-pets");
    let objectStore=transactionFalse.objectStore("profiles-pets");
    let cursor=objectStore.openCursor();
    let mostrado=0;
    cursor.addEventListener("success",(e)=>{
        let puntero=e.target.result;
        if(puntero){
            if(puntero.value.idOwnerPet==idOwner){
                containerOtherPets.innerHTML+= `<div class="carta">
                
                <img src="/img/png-clipart-dog-paw-silhouette-dog-animals-paw.png" class="sinFace">

                <div class='${puntero.value.idOwnerPet}  carta2'>
                <p><strong>Nombre:</strong>
                <input value='${puntero.value.name}' class="valor" disabled></p><br>

                <p><strong>Documento:</strong>
                <input value='${puntero.value.idOwnerPet}' class="valor" disabled></p><br>

                <p><strong>Nombre del acudiente:</strong>
                <input value='${puntero.value.ownerName}' class="valor" disabled></p><br>

                  
                `;;
                mostrado++;
            }
            puntero.continue();
        }
    
    });

}