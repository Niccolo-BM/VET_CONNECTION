/*ZONA DE mistakes PERSONALIZADOS*/ 


class EmailNotFound extends Error{
    constructor(message){
        super(message);
    }
}

class incorrectPassword extends Error{
    constructor(message){
        super(message);
    }
}


class incorrectEmail extends Error{
    constructor(message){
        super(message);
    }
}







// page header and footer script
let icon=document.querySelector(".material-symbols-outlined");
let menuHidden=document.querySelector(".menuHidden");
let searchHidden=document.querySelector(".searchHidden");


icon.addEventListener("click",(e)=>{
    menuHidden.classList.toggle("viewMenu");
    searchHidden.classList.remove("viewSearch");
});

let search=document.querySelector(".material-symbols-outlined1");

search.addEventListener("click",(e)=>{
    menuHidden.classList.remove("viewMenu");
    searchHidden.classList.toggle("viewSearch");
});


//Selected elements html

let containerMistakes=document.querySelector(".containerMistakes");

let returnMainPage=document.querySelector(".returnPage");

let returnToHome=document.querySelector(".returnToHome");

let buttonSendForm=document.getElementById("btn1");



//inicializamos base de datos
let solicitud=indexedDB.open("datos");
var baseDatos;

solicitud.onerror=()=>{
    alert("sucedio un error");
}

solicitud.onsuccess=()=>{
    baseDatos=solicitud.result;
    
    
    buttonSendForm.addEventListener("click",(e)=>{
        e.preventDefault();
        verifyEntity()
        .then((value)=>{
            
            if(value==1){           //En caso de qe sea para veterinaria
                validateEmailVeterinary()

                .then(()=>{

                    changeLoggedInValue()
                    .then(()=>{
                        alert("resolvimos");
                        window.location.replace("/page3/cuartaPagina.html");

                    })

                    .catch(()=>{alert("no se pudo");})
                })


                .catch((error)=>{
                    containerMistakes.innerHTML=error.message;
                    setTimeout(()=>{
                        containerMistakes.innerHTML="";                                     // verificamos dependiendo de quien entre a iniciar sesion
                    },3000);
                })

            }
            else if(value==2){        //En caso de qe sea para medico
                validateEmailMedical()

                .then(()=>{window.location.replace("/page3-InicioMedico/cuartaPagina2.html");})

                .catch((error)=>{
                    containerMistakes.innerHTML=error.message;
                    setTimeout(()=>{
                        containerMistakes.innerHTML="";
                    },3000);
                })
            }
            else{                     //En caso de qe sea para usuario
                validateEmailPatient()

                .then(()=>{alert("pagina de dueño mascota")})

                .catch((error)=>{
                    containerMistakes.innerHTML=error.message;
                    setTimeout(()=>{
                        containerMistakes.innerHTML="";
                    },3000);
                })
            }
            
        })
        .catch((e)=>{alert(e);});

    });
    



    returnMainPage.addEventListener("click",changeValueSesion); //Por si presiona el boton de volver hacia atras 
    returnToHome.addEventListener("click",changeValueSesion);   //Por si presiona el boton de home cambiar tambien el valor
}


//ZONA DE FUNCIONES





// 1-ZONA DE VETERINARIAS


const validateEmailVeterinary=()=>{
    return new Promise((resolve,reject)=>{
        let email=document.querySelector(".email").value;
        let password=document.querySelector(".password").value;

        let transaccion=baseDatos.transaction("veterinarys");
        let objetStore=transaccion.objectStore("veterinarys");

        // let indice=objetStore.index("veterinaryNitIndex");

        // let rango=IDB.only(email);

        let cursor=objetStore.openCursor();

        cursor.addEventListener("success",(e)=>{
            let puntero=e.target.result;
            
            if(puntero){
               
                if(puntero.value.veterinaryPassword==password && puntero.value.veterinaryEmail==email){
                    resolve();
                    return;
                }
                puntero.continue();
            }
            else{
                reject(new EmailNotFound("datos Incorrectos"));

            }
        })
     

    })
}

//_________________________________________



// 2- ZONA DE VETERINARIOS



const validateEmailMedical=()=>{
    return new Promise((resolve,reject)=>{
        let email=document.querySelector(".email").value;
        let password=document.querySelector(".password").value;

        let transaccion=baseDatos.transaction("medical-profiles");
        let objetStore=transaccion.objectStore("medical-profiles");

        // let indice=objetStore.index("veterinaryNitIndex");

        // let rango=IDB.only(email);

        let cursor=objetStore.openCursor();

        cursor.addEventListener("success",(e)=>{
            let puntero=e.target.result;
            
            if(puntero){
               
                if(puntero.value.password==password && puntero.value.email==email){
                    resolve();
                    return;
                }
                puntero.continue();
            }
            else{
                reject(new EmailNotFound("datos Incorrectos"));

            }
        })
     

    })
}

//_________________________________________




const validateEmailPatient=()=>{
    return new Promise((resolve,reject)=>{
        let email=document.querySelector(".email").value;
        let password=document.querySelector(".password").value;

        let transaccion=baseDatos.transaction("profiles-pets");
        let objetStore=transaccion.objectStore("profiles-pets");

        let cursor=objetStore.openCursor();

        cursor.addEventListener("success",(e)=>{
            let puntero=e.target.result;
            
            if(puntero){
               
                if(puntero.value.passwordPet==password && puntero.value.emailPet==email){
                    resolve();
                    return;
                }
                puntero.continue();
            }
            else{
                reject(new EmailNotFound("datos Incorrectos"));

            }
        })
     

    })
}

//_________________________________________



const verifyEntity=()=>{
        return new Promise((resolve,reject)=>{
        let transaction=baseDatos.transaction("entity");
        let objectStore=transaction.objectStore("entity");
        let cursor=objectStore.openCursor();
        let option=0;
        cursor.addEventListener("success",()=>{
            let puntero=cursor.result;
            if(puntero){
                if(puntero.value.activateVeterinary==true){
                    option++;
                        // Esto equivale a veterinaria
                }
                else if(puntero.value.activateDoctor==true){
                    option+=2;       // Esto equivale a doctor
                }
                puntero.continue();
            }
            else{
                resolve(option);
            }
        });

        cursor.onerror=()=>{
            reject("error fijo");
        }
    });
}





const changeValueSesion=()=>{
    let transaction=baseDatos.transaction("entity","readwrite");
    let objectStore=transaction.objectStore("entity");
    let cursor=objectStore.openCursor();

    cursor.addEventListener("success",()=>{
        let puntero=cursor.result;
        if(puntero){
            let value=puntero.value;
            if(puntero.value.activateVeterinary){
                value.activateVeterinary=false;
                puntero.update(value);
            }

            else if(puntero.value.activateDoctor){
                value.activateDoctor=false;
                puntero.update(value);
            }
            else{
                value.activatePatient=false;
                puntero.update(value);
            }
            puntero.continue();
        }
    });
}



// __________________________________________



const changeLoggedInValue=()=>{
    return new Promise((resolve,reject)=>{
        let email=document.querySelector(".email").value;
    let transaccion=baseDatos.transaction("veterinarys","readwrite");
    let objetStore=transaccion.objectStore("veterinarys");


    let indice=objetStore.index("EmailVeterinaryIndex");

    let rango=IDBKeyRange.only(email);

    let cursor=indice.openCursor(rango);

    cursor.addEventListener("success",(e)=>{
        let puntero=e.target.result;
        if(puntero){
            let valor=puntero.value;
            if(valor.veterinaryStart==false){
                valor.veterinaryStart = true; // Modificar la propiedad inicio a true
                alert("tambiem entramos aca");
                puntero.update(valor); 
                resolve();
            }
            }else{
            reject(new EmailNotFound("El email no existe"));
        }   
    });
    });
}
