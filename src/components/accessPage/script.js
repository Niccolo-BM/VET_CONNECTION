// page header and footer script
let icon=document.querySelector(".material-symbols-outlined");
let menuHidden=document.querySelector(".menuHidden");
let searchHidden=document.querySelector(".searchHidden");
let body=document.querySelector(".body2");

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
    let evento=e.target;
    if(!evento.className.includes("material-symbols-outlined") && !evento.className.includes("material-symbols-outlined1") ){
        menuHidden.classList.remove("viewMenu");
        searchHidden.classList.remove("viewSearch");
    }

});
//IMGS whit enlace
//IMGS whit enlace
let veterinaryAccess=document.querySelector(".accesVeterinary");
let medicalAccess=document.querySelector(".accesMedical");
let petsAccess=document.querySelector(".accesPets");


// BUttons whit enlaces

let buttonVeterinary=document.querySelector(".veterinarys");
let buttonDoctor=document.querySelector(".doctors");
let buttonPatient=document.querySelector(".patients");


var solicitud=indexedDB.open("datos");

var baseDatos;

solicitud.onerror=()=>{
    alert("Ocurrio un error");
}


solicitud.onsuccess=()=>{
    baseDatos=solicitud.result;
    console.log("ya estamos melos");

    resetValuesEntitys().then().catch();

    //  dataDoctor();

    // dataVete()
    // dataPet();

    countingValues()
    .then((value)=>{
        valueInitial(value);

            veterinaryAccess.addEventListener("click",(e)=>{
                e.preventDefault();                                     // eventos para inicio de veterinaria
                changeStartedSessionValueVeterinary()
                .then(()=>{
                    window.location.replace("/src/components/login/index.html");
                })
                .catch(()=>{alert("error en el click");});
            });


            buttonVeterinary.addEventListener("click",(e)=>{
                e.preventDefault();                                     // eventos para inicio de veterinaria
                changeStartedSessionValueVeterinary()
                .then(()=>{
                    window.location.replace("/src/components/login/index.html");
                })
                .catch(()=>{alert("error en el click");});
            });


//___________________________________________________________

            medicalAccess.addEventListener("click",(e)=>{

                e.preventDefault();
                changeStartedSessionValueDoctor()
                .then(()=>{
                    window.location.replace("/src/components/login/index.html");
                })
                .catch(()=>{alert("error en el click");});                  //eventos para inicio de doctor
            });

            buttonDoctor.addEventListener("click",(e)=>{

                e.preventDefault();
                changeStartedSessionValueDoctor()
                .then(()=>{
                    window.location.replace("/src/components/login/index.html");
                })
                .catch(()=>{alert("error en el click");});                  //eventos para inicio de doctor
            });


//___________________________________________________________


            petsAccess.addEventListener("click",(e)=>{

                e.preventDefault();
                changeStartedSessionValuePatient()
                .then(()=>{
                    window.location.replace("/src/components/login/index.html");
                })
                .catch(()=>{alert("error en el click");});                  //eventos para inicio paciente

            });

            buttonVeterinary.addEventListener("click",(e)=>{

                e.preventDefault();
                changeStartedSessionValuePatient()
                .then(()=>{
                    window.location.replace("/src/components/login/index.html");
                })
                .catch(()=>{alert("error en el click");});                  //eventos para inicio paciente

            });


        })
    .catch((e)=>{
        console.log(e);         // Posible error al momento de verificar cual entidad esta activa
    });
}

// ____________________________________


solicitud.onupgradeneeded=()=>{
    baseDatos=solicitud.result;
    let storeVeterinary=baseDatos.createObjectStore("veterinarys",{keyPath:"id"});
    let storeMedicalHistory=baseDatos.createObjectStore("medical-history",{autoIncrement:true});
    let storeMedicalProfiles=baseDatos.createObjectStore("medical-profiles",{keyPath:"clave"});
    let storeProfilePets=baseDatos.createObjectStore("profiles-pets",{autoIncrement:true});
    let storeActive=baseDatos.createObjectStore("entity",{autoIncrement:true});

    //indecies del storeVeterinary

    storeVeterinary.createIndex("veterinaryNameIndex","veterinaryName",{unique:true});
    storeVeterinary.createIndex("veterinaryNitIndex","veterinaryNit",{unique:true});
    storeVeterinary.createIndex("EmailVeterinaryIndex","veterinaryEmail",{unique:true});
    storeVeterinary.createIndex("passwordVeterinaryIndex","veterinaryPassword",{unique:false});
    storeVeterinary.createIndex("veterinaryPhoneIndex","veterinaryPhone",{unique:false});
    storeVeterinary.createIndex("veterinaryAdressIndex","veterinaryAdress",{unique:false});
    storeVeterinary.createIndex("veterinaryStartIndex","veterinaryStart",{unique:true});
    storeVeterinary.createIndex("urlPhotoVeterinaryIndex","urlPhotoVeterinary",{unique:false})



    //indices del storeMedicalHistory
    storeMedicalHistory.createIndex("descriptionPetIndex","descriptionPet",{unique:false});
    storeMedicalHistory.createIndex("physicalExamIndex","physicalExam",{unique:false});
    storeMedicalHistory.createIndex("diagnosisPetIndex","diagnosisPet",{unique:false});
    storeMedicalHistory.createIndex("treatmentPetIndex","treatmentPet",{unique:false});
    storeMedicalHistory.createIndex("medicalMotoringPetIndex","medicalMotoringPet",{unique:false});
    storeMedicalHistory.createIndex("commentsPetIndex","commentsPet",{unique:false});
    storeMedicalHistory.createIndex("idOwnerPetIndex","idOwnerPet",{unique:false});
    storeMedicalHistory.createIndex("idDoctorPetIndex","idDoctorPet",{unique:false});
    storeMedicalHistory.createIndex("namePetIndex","namePet",{unique:false});
    storeMedicalHistory.createIndex("DateIndex","infoDates",{unique:false});



    //Indices del storeMedicalProfiles

    storeMedicalProfiles.createIndex("idIndex","id",{unique:true});
    storeMedicalProfiles.createIndex("emailIndex","email",{unique:true});
    storeMedicalProfiles.createIndex("passwordIndex","password",{unique:false});
    storeMedicalProfiles.createIndex("nameIndex","name",{unique:false});
    storeMedicalProfiles.createIndex("specialtyDoctorIndex","specialtyDoctor",{autoIncrement:true});
    storeMedicalProfiles.createIndex("cityIndex","city",{autoIncrement:true});
    storeMedicalProfiles.createIndex("nitAssociateVeterinarianIndex","nitVete",{unique:false});
    storeMedicalProfiles.createIndex("validateStartIndex","start",{unique:false});
    storeMedicalProfiles.createIndex("urlPhotoDoctorIndex","urlPhotoDoctor",{unique:false});

    //Indices del storeProfilePets

    storeProfilePets.createIndex("namePetIndex","name",{unique:false});
    storeProfilePets.createIndex("idOwnerPetIndex","idOwnerPet",{unique:false});
    storeProfilePets.createIndex("specieIndex","specie",{unique:false});
    storeProfilePets.createIndex("razaIndex","raza",{unique:false});
    storeProfilePets.createIndex("ageIndex","age",{unique:false});
    storeProfilePets.createIndex("directionHousePetIndex","directionHouse",{unique:false});
    storeProfilePets.createIndex("telefonoIndex","ownerPhone",{unique:false});
    storeProfilePets.createIndex("passwordPetIndex","passwordPet",{unique:false});
    storeProfilePets.createIndex("profileIndex","startProfile",{unique:true});
    storeProfilePets.createIndex("doctorInchargeIndex","medicalIdInCharge",{unique:false});
    storeProfilePets.createIndex("ownerNameIndex","ownerName",{unique:false});
    storeProfilePets.createIndex("urlPhotoPetsIndex","urlPhotoPets",{unique:false});


    //
    storeActive.createIndex("activeVeterinaryIndex","activateVeterinary",{unique:true});
    storeActive.createIndex("avtiveDoctorIndex","activateDoctor",{unique:true});
    storeActive.createIndex("avtivePatientIndex","activatePatient",{unique:true});



}

// ___________________________________________________________________

let valueStore=0;
const countingValues=()=>{
    return new Promise((resolve,reject)=>{
        let transaction=baseDatos.transaction("entity");
        let objectStore=transaction.objectStore("entity");
        let cursor=objectStore.openCursor();

        cursor.addEventListener("success",(e)=>{
            let puntero=e.target.result;
            if(puntero){
                valueStore++;
                puntero.continue();
            }
            else{
                resolve(valueStore);
            }
        });

        cursor.onerror=()=>{
            reject("hubo un problma");
        }
    });
}

// ___________________________________________________________________


const valueInitial=(value)=>{
    if(value==0){
        let transaction=baseDatos.transaction("entity","readwrite");
        let objectStore=transaction.objectStore("entity");
        objectStore.add({
            activateVeterinary:false,
            activateDoctor:false,
            activatePatient:false
        });
    }
}


// ___________________________________________________________________


const changeStartedSessionValueVeterinary=()=>{
    return new Promise((resolve,reject)=>{
        let transaction=baseDatos.transaction("entity","readwrite");
        let objectStore=transaction.objectStore("entity");
        let cursor=objectStore.openCursor();

        transaction.oncomplete=()=>{
            resolve();
        }

        transaction.onerror=()=>{
            reject();
        }

        let cursorStopped=false;


        cursor.addEventListener("success",(e)=>{
            let puntero=e.target.result;
            if(puntero && !cursorStopped){
                let value=puntero.value;
                if(puntero.value.activateVeterinary==false){
                    value.activateVeterinary=true;
                    puntero.update(value);
                    cursorStopped=true;
                }
                puntero.continue();
            }
        });
    });
}


// ___________________________________________________________________



const changeStartedSessionValueDoctor=()=>{
    return new Promise((resolve,reject)=>{
        let transaction=baseDatos.transaction("entity","readwrite");
        let objectStore=transaction.objectStore("entity");
        let cursor=objectStore.openCursor();

        
        transaction.oncomplete=()=>{
            resolve();
        }

        transaction.onerror=()=>{
            reject();
        }

        let cursorStopped=false;



        cursor.addEventListener("success",(e)=>{
            let puntero=e.target.result;
            if(puntero && !cursorStopped){
                let value=puntero.value;
                if(puntero.value.activateDoctor==false){
                    value.activateDoctor=true;
                    puntero.update(value);
                    cursorStopped=true;
                }
                puntero.continue();
            }
        });
    });
}

// ___________________________________________________________________



const changeStartedSessionValuePatient=()=>{
    return new Promise((resolve,reject)=>{
        let transaction=baseDatos.transaction("entity","readwrite");
        let objectStore=transaction.objectStore("entity");
        let cursor=objectStore.openCursor();

        
        transaction.oncomplete=()=>{
            resolve();
        }

        transaction.onerror=()=>{
            reject();
        }

        let cursorStopped=false;


        cursor.addEventListener("success",(e)=>{
            let puntero=e.target.result;
            if(puntero && !cursorStopped){
                let value=puntero.value;
                if(puntero.value.activatePatient==false){
                    value.activatePatient=true;
                    puntero.update(value);
                    cursorStopped=true;
                }
                puntero.continue();
            }
        });
    });
}


//_________________________________________

// const changeValueOthersEntity=()=>{
//     return new Promise((resolve,reject)=>{
//         let transaction=baseDatos.transaction("entity","readwrite");
//         let objectStore=transaction.objectStore("entity");
//         let cursor=objectStore.openCursor();
//         cursor.addEventListener("success",(e)=>{
//             let puntero=e.target.result;
//             if(puntero){
//                 let value=puntero.value;
//                 if(puntero.value.activatePatient==false){
//                     value.activatePatient=true;
//                     puntero.update(value);
//                     resolve();
//                 }
//                 puntero.continue();
//             }
//             else{
//                 reject();
//             }
//         });
//     });
// }



const dataDoctor=()=>{
    let transaccion=baseDatos.transaction("medical-profiles","readwrite");
    let objectStore=transaccion.objectStore("medical-profiles");
    objectStore.add({
        clave : new Date().toISOString(),
            name : "jhoatan",
            id : "1020222769",
            nitVete:"123456789",
            email : "jhona@gmail.com",
            password : "1020222769",
            specialtyDoctor : "general",
            city :"medellin",
            start:false,
            urlPhotoDoctor:''
    });
}


const dataPet=()=>{
    let transaccion=baseDatos.transaction("profiles-pets","readwrite");
    let objectStore=transaccion.objectStore("profiles-pets");
    objectStore.add({
        fecha : new Date().toISOString(),
            name : "mike",
            idOwnerPet : "0000000000",
            specie:"canina",
            raza : "pitbull",
            edad : "4",
            directionHouse : "calle 9 a sur",
            ownerPhone :"3165820442",
            passwordPet:"Mike123",
            startProfile:false,
            medicalIdInCharge:"1020222769",
            ownerName:"julian garcia",
            urlPhotoPets:""
    });
}



const dataVete=()=>{
    let transaccion=baseDatos.transaction("veterinarys","readwrite");
    let objectStore=transaccion.objectStore("veterinarys");
    objectStore.add({
        id : new Date().toISOString(),
        veterinaryName: "perrunos",
        veterinaryNit : "123456789",
        veterinaryEmail:"perrunos@gmail.com",
        veterinaryPassword: "El966",
        veterinaryStart : false,
        urlPhotoVeterinary:""
    });
}


const resetValuesEntitys=()=>{
    return new Promise((resolve,reject)=>{
        let transaction=baseDatos.transaction("entity","readwrite");
        let objectStore=transaction.objectStore("entity");
        let cursor=objectStore.openCursor();

        let cursorStopped=false;

        cursor.onsuccess=(e)=>{
            let puntero=e.target.result;
            if(puntero && !cursorStopped){
                let values=puntero.value;

                values.activateVeterinary=false;
                values.activateDoctor=false;
                values.activatePatient=false;
                puntero.update(values);

                puntero.continue();
            }
        }

    });
}