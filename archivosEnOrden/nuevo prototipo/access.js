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
    
    countingValues()
    .then((value)=>{
        valueInitial(value);
        
            veterinaryAccess.addEventListener("click",(e)=>{
                e.preventDefault();                                     // eventos para inicio de veterinaria
                changeStartedSessionValueVeterinary()
                .then(()=>{
                    window.location.replace("/nuevo prototipo/start.html");
                })
                .catch(()=>{alert("error en el click");});
            });


            buttonVeterinary.addEventListener("click",(e)=>{
                e.preventDefault();                                     // eventos para inicio de veterinaria
                changeStartedSessionValueVeterinary()
                .then(()=>{
                    window.location.replace("/nuevo prototipo/start.html");
                })
                .catch(()=>{alert("error en el click");});
            });


//___________________________________________________________

            medicalAccess.addEventListener("click",(e)=>{

                e.preventDefault();
                changeStartedSessionValueDoctor()
                .then(()=>{
                    window.location.replace("/nuevo prototipo/start.html");
                })
                .catch(()=>{alert("error en el click");});                  //eventos para inicio de doctor
            });

            buttonDoctor.addEventListener("click",(e)=>{
                
                e.preventDefault();
                changeStartedSessionValueDoctor()
                .then(()=>{
                    window.location.replace("/nuevo prototipo/start.html");
                })
                .catch(()=>{alert("error en el click");});                  //eventos para inicio de doctor
            });
            

//___________________________________________________________


            petsAccess.addEventListener("click",(e)=>{

                e.preventDefault();
                changeStartedSessionValuePatient()
                .then(()=>{
                    window.location.replace("/nuevo prototipo/start.html");
                })
                .catch(()=>{alert("error en el click");});                  //eventos para inicio paciente

            });

            buttonVeterianry.addEventListener("click",(e)=>{
                
                e.preventDefault();
                changeStartedSessionValuePatient()
                .then(()=>{
                    window.location.replace("/nuevo prototipo/start.html");
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
    let storeProfilePets=baseDatos.createObjectStore("profiles-pets",{keyPath:"fecha"});
    let storeActive=baseDatos.createObjectStore("entity",{autoIncrement:true});

    //indecies del storeVeterinary

    storeVeterinary.createIndex("veterinaryNameIndex","veterinaryName",{unique:true});
    storeVeterinary.createIndex("veterinaryNitIndex","veterinaryNit",{unique:true});
    storeVeterinary.createIndex("EmailVeterinaryIndex","veterinaryEmail",{unique:true});
    storeVeterinary.createIndex("passwordVeterinaryIndex","veterinaryPassword",{unique:false});
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
    storeProfilePets.createIndex("emailPetIndex","emailPet",{unique:false});
    storeProfilePets.createIndex("cityPetIndex","cityPet",{unique:false});
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
        cursor.addEventListener("success",(e)=>{
            let puntero=e.target.result;
            if(puntero){
                let value=puntero.value;
                if(puntero.value.activateVeterinary==false){
                    value.activateVeterinary=true;
                    puntero.update(value);
                    window.location.replace("/nuevo prototipo/start.html");

                    resolve();

                }
                puntero.continue();
            }     
            else{
                reject();
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
        cursor.addEventListener("success",(e)=>{
            let puntero=e.target.result;
            if(puntero){
                let value=puntero.value;
                if(puntero.value.activateDoctor==false){
                    value.activateDoctor=true;
                    puntero.update(value);
                    resolve();
                }
                puntero.continue();
            }          
        });

        cursor.onerror=()=>{
            reject();
        }

    });      
}
    
// ___________________________________________________________________



const changeStartedSessionValuePatient=()=>{
    return new Promise((resolve,reject)=>{
        let transaction=baseDatos.transaction("entity","readwrite");
        let objectStore=transaction.objectStore("entity");
        let cursor=objectStore.openCursor();
        cursor.addEventListener("success",(e)=>{
            let puntero=e.target.result;
            if(puntero){
                let value=puntero.value;
                if(puntero.value.activatePatient==false){
                    value.activatePatient=true;
                    puntero.update(value);
                    resolve();
                }
                puntero.continue();
            }       
            else{
                reject();
            }
        });
    });      
}
    
