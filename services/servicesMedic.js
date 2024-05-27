
export class duplicateId extends Error{
    constructor(message){
        super(message);
    }
}



export class EmailNotFound extends Error{
    constructor(message){
        super(message);
    }
}




export class rangeId extends Error{
    constructor(message){
        super(message);
    }
}



export class datesInvalid extends Error{
    constructor(message){
        super(message);
    }
}


export class completeName extends Error{
    constructor(message){
        super(message);
    }
}


export class invalidPhone extends Error{
    constructor(message){
        super(message);
    }
}


export class improvePassword extends Error{
    constructor(message){
        super(message);
    }
}



export class badEmailEstructure extends Error{
    constructor(message){
        super(message);
    }
}


export class notFoundId extends Error{
    constructor(message){
        super(message);
    }
}


export class CedulaNotFound extends Error{
    constructor(message){
        super(message);
    }
}


export class cedulaLength extends Error{
    constructor(message){
        super(message);
    }
}


export class onlyNumbers extends Error{
    constructor(message){
        super(message);
    }
}


export class inicioNotFound extends Error{
    constructor(message){
        super(message);
    }
}





export const showPhotoInContainer=(baseDatos)=>{
    return new Promise((resolve,reject)=>{
        let transaction=baseDatos.transaction("profiles-pets");
        let objectStore=transaction.objectStore("profiles-pets");
        let cursor=objectStore.openCursor();

        cursor.onsuccess=(e)=>{
            let puntero=e.target.result;
            if(puntero){
                if(puntero.value.startProfile==true){
                    resolve(puntero.value.urlPhotoPets);
                }                                                   //EXPORTAR
                puntero.continue();
            }
            else{
                reject("no hay ninguna url");
            }
        }
    });
}


// ________________




export const returnActivePet=(baseDatos)=>{
    return new Promise((resolve,reject)=>{
     let transaction=baseDatos.transaction("profiles-pets");
     let objectStore=transaction.objectStore("profiles-pets");
     let cursor=objectStore.openCursor();
     cursor.onsuccess=(e)=>{
         let puntero=e.target.result;
         if(puntero){
             let value=puntero.value;
             if(value.startProfile==true){
                 resolve([value.idOwnerPet,value.name])
                 return;
             }
             puntero.continue();
         }
     }
 
     cursor.onerror=()=>{
         reject("No hay nada activo");
     }
    });
 }
 

//_______________________________________


const resultados=[];
export const viewMedicalHistory=(baseDatos,idOwner,namePet)=>{
    return new Promise((resolve,reject)=>{
        let history=0;
        let transaction=baseDatos.transaction("medical-history");
        let objectStore=transaction.objectStore("medical-history");
        let cursor=objectStore.openCursor();
        cursor.onsuccess=(e)=>{
            let puntero=e.target.result;
            if(puntero){
                let value=puntero.value;
                if(value.idOwnerPet==idOwner && value.namePet==namePet){
                    const resultsHTML=
                    `<div class="grid">
                <div class="containerHistory">
                <h2> Historia clinica </h2><br> 
                <div class="containerText">
                   
                    <strong>description :</strong>  <p>${puntero.value.descriptionPet}</p> <br> <br>
                    
                    <strong> exam physical :</strong> <p>${puntero.value.physicalExam}</p> <br> <br>
                    <strong> diagnosis :</strong> <p>${puntero.value.diagnosisPet}</p> <br> <br>
                    <strong> treatment :</strong> <p>${puntero.value.treatmentPet}</p> <br> <br>
                    <strong> medical Motoring :</strong> <p>${puntero.value.medicalMotoringPet}</p> <br> <br>
                    </div>
                </div>

                <div class="containerComments">
                    <h2> comments</h2> <br> 

                    <div class="containerText">
                    <p> ${puntero.value.commentsPet}</p>
                    </div>
                    <span class="date">
                        Esta historia fue hecha el ${puntero.value.infoDates}
                    </span>
                    </div>

                    </div>`
                    history++;
       
                resultados.push(resultsHTML);
                }

                puntero.continue();
            }
            else if(history==0){
                reject();
            }
            else{
                console.log(resultados);
                resolve(resultados.reverse());
            }
        }
    });
}




//_______________________________________



export const readFile=(image)=>{
    return new Promise((resolve,reject)=>{
        const reader=new FileReader();
        reader.readAsDataURL(image); 
        
        reader.addEventListener("load",(e)=>{
            resolve(e.target.result);
        });
    });
}

//_______________________________________



export const changeUrlPhoto=(baseDatos,url)=>{
    return new Promise((resolve,reject)=>{
        let transaction=baseDatos.transaction("profiles-pets","readwrite");
        let objectStore=transaction.objectStore("profiles-pets");
        let cursor=objectStore.openCursor();

        cursor.onsuccess=(e)=>{
            let puntero=e.target.result;
            if(puntero){
                if(puntero.value.startProfile==true){              //EXPORTAR
                    let valueChange=puntero.value;
                    valueChange.urlPhotoPets=url;
                    puntero.update(valueChange);
                    setTimeout(()=>{
                        resolve();
                    },2000);
                }
                puntero.continue();
            }
        }
        cursor.onerror=()=>{
            reject("No se pudo cambiar la foto de perfil");
        }
    });
}


//_______________________________________




export const validateloginUser=(baseDatos)=>{
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

//_______________________________________


export const obtainDoctorID=(baseDatos)=>{  //Funcion encargada de conseguir ceduldel dueño y cedula del animal y hacer otra funcion
    return new Promise((resolve,reject)=>{
        let transactionValue=baseDatos.transaction("profiles-pets");
        let objectStore=transactionValue.objectStore("profiles-pets");
        let cursor=objectStore.openCursor();
    
        cursor.addEventListener("success",(e)=>{
            let puntero=e.target.result;
            if(puntero){
                if(puntero.value.startProfile==true){
                   resolve([puntero.value.idOwnerPet,puntero.value.name]);
                }
                puntero.continue();
            }

            else{
                reject(new inicioNotFound("No se encontro ningun perfil activo"));
            }
        });
    
    });
}

//_______________________________________


export const uploaData=(baseDatos,idOwnerPet,namePets)=>{   
    return new Promise((resolve,reject)=>{

        //Funcion encargada de subir los datos
    let description=document.querySelector(".description").value;
    let physical=document.querySelector(".physical").value;
    let diagnosis=document.querySelector(".diagnosis").value;
    let treatment=document.querySelector(".treatment").value;
    let medicalMotoring=document.querySelector(".follow-up").value;
    let comments=document.querySelector(".comments").value;


    let transactionValue=baseDatos.transaction("medical-history","readwrite");
    let openStore=transactionValue.objectStore("medical-history");

    let reloj=new Date();
    let fecha=`${reloj.getDate()} / ${reloj.getMonth()+1} / ${reloj.getFullYear()}`;
    let hora=`${reloj.getHours()}:${reloj.getMinutes()}`;

    let infoDate=`${fecha} a las ${hora} hora militar`;

    openStore.add({
        id:new Date().toISOString(),
        descriptionPet:description,
        physicalExam:physical,
        diagnosisPet:diagnosis,
        treatmentPet:treatment,
        medicalMotoringPet:medicalMotoring,
        commentsPet:comments,
        idOwnerPet:idOwnerPet,
        namePet:namePets,
        infoDates:infoDate
    });

    let description2=document.querySelector(".description").value="";
    let physical2=document.querySelector(".physical").value="";
    let diagnosis2=document.querySelector(".diagnosis").value="";
    let treatment2=document.querySelector(".treatment").value="";
    let medicalMotoring2=document.querySelector(".follow-up").value="";
    let comments2=document.querySelector(".comments").value="";

    transactionValue.oncomplete=()=>{
        resolve();
    }

    transactionValue.onerror=()=>{
        reject();
    }

    });   
}




//_______________________________________


export const changeStartedSessionValue=(baseDatos)=>{
    return new Promise((resolve,reject)=>{
    let transaction=baseDatos.transaction("profiles-pets","readwrite");
    let objetStore=transaction.objectStore("profiles-pets");


    let cursor=objetStore.openCursor();
    cursor.addEventListener("success",(e)=>{
        let puntero=e.target.result;
        if(puntero){
            let valor=puntero.value;
            if(valor.startProfile==true){
                valor.startProfile = false; // Modificar la propiedad inicio a true
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

//_______________________________________

export const idPet=(baseDatos)=>{
    return new Promise((resolve,reject)=>{
        let transaction=baseDatos.transaction("profiles-pets");
        let objectStore=transaction.objectStore("profiles-pets");
        let cursor=objectStore.openCursor();
                                                                        //EXPORTAR
        cursor.onsuccess=(e)=>{
            let puntero=e.target.result;
            if(puntero){
                if(puntero.value.startProfile==true){
                    resolve(puntero.key);
                }
                puntero.continue();
            }
        }
    });
}

//_______________________________________


export const deletePet=(baseDatos,id)=>{
    return new Promise((resolve,reject)=>{
        let transaction=baseDatos.transaction("profiles-pets","readwrite");
        let objectStore=transaction.objectStore("profiles-pets");
         objectStore.delete(id);    

         transaction.oncomplete=()=>{
            resolve();
         }

         transaction.onerror=()=>{
            reject();
         }
    });                                      //EXPORTAR
}



export const activatePatient=(baseDatos)=>{
    return new Promise((resolve,reject)=>{
        let valueId=document.querySelector(".email").value;
        let password=document.querySelector(".password").value;
        let transaction=baseDatos.transaction("profiles-pets","readwrite");
        let objectStore=transaction.objectStore("profiles-pets");

        let cursor=objectStore.openCursor();

        transaction.oncomplete=()=>{
            window.location.replace("/page5-USER/sextaPagina.html");
            resolve();
        }
        transaction.onerror=()=>{
            reject("No se pudo cambiar la foto de perfil");
        }

        let cursorStopped=false;

        cursor.onsuccess=(e)=>{
            let puntero=e.target.result;
            if(puntero && !cursorStopped){
                let value=puntero.value;
                if(value.idOwnerPet==valueId && value.passwordPet == password && value.startProfile==false){
                    value.startProfile=true;
                    puntero.update(value);
                    cursorStopped=true;
                }
                puntero.continue();
            }
            else{
                reject("no se pudo");
            }
        }
    });
}


export const activateDoctor=(baseDatos)=>{
    return new Promise((resolve,reject)=>{
        let valueId=document.querySelector(".email").value;
        let password=document.querySelector(".password").value;
        let transaction=baseDatos.transaction("medical-profiles","readwrite");
        let objectStore=transaction.objectStore("medical-profiles");

        let cursor=objectStore.openCursor();

        
        transaction.oncomplete=()=>{
            window.location.replace("/src/components/homeMedic/index.html");
            resolve();
        }
        transaction.onerror=()=>{
            reject("No se pudo cambiar la foto de perfil");
        }

        let cursorStopped=false;

       
        cursor.onsuccess=(e)=>{
            let puntero=e.target.result;
            if(puntero && !cursorStopped){
                let value=puntero.value;
                if(value.email==valueId && value.password == password && value.start==false){
                    value.start=true;
                    puntero.update(value);
                    cursorStopped=true;
                }
                puntero.continue();
            }
            else{
                reject("no se pudo");
            }
        }
    });
}




// export const changeValueEntity=(baseDatos)=>{
//     return new Promise((resolve,reject)=>{
//         let transaction=baseDatos.transaction("entity","readwrite");
//         let objectStore=transaction.objectStore("entity");
//         let cursor =objectStore.openCursor();

//         cursor.onsuccess=(e)=>{
//             let puntero=e.target.result;
//             if(puntero){
//                 if(puntero.value.activateVeterinary || puntero.value.activateDoctor || puntero.value.activatePatient){
//                     let value=puntero.value;
//                     value.activateVeterinary=false;
//                     value.activateDoctor=false;
//                     value.activatePatient=false;
//                     puntero.update(value);
//                     resolve();
//                 }
//                 puntero.continue();
//             }
//             else{
//                 reject();
//             }
//         }
//     });
// }

// __________________________________________


export const verifyStarVeterinarys=(baseDatos)=>{
    return new Promise((resolve,reject)=>{
        let transaction=baseDatos.transaction("entity");
        let objectStore=transaction.objectStore("entity");
        let cursor=objectStore.openCursor();

        cursor.onsuccess=(e)=>{
            let puntero=e.target.result;
            if(puntero){
                if(puntero.value.activateVeterinary==false){
                    resolve();
                }
                puntero.continue();
            }
            else{
                reject();
            }
        }
});
}