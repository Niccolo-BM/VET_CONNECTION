

//Errores personalizados




//Elementos html escojidos del html
let containerWelcom=document.querySelector(".container");

let containerProfile=document.querySelector(".containerProfile");

let containerInformation=document.querySelector(".innerPart");

let exit=document.querySelector(".exit"); // elemetno que dice exit sesion
// let perfil=document.querySelector(".perfil");

let showVeterinarian=document.querySelector(".containerVeterinarians");//container donde se mostraran sus perfiles

let containerProfiles=document.querySelector(".containerCreateProfiles"); //formulario desplegable para crear nuevo veterinaria

let newVet=document.querySelector(".create"); // boton de crear perfiles

let viewProfiles=document.querySelector(".viewProfiles"); //boton para view perfiles


let equis=document.querySelector(".equis");
//Abriendo base datos

//Eventos y demas cosas que involucren la base de datos

let solicitud=indexedDB.open("datos");
var baseDatos;

solicitud.onerror=function(){
    alert("la base de datos tuvo un problema");
}

solicitud.onsuccess=function(){
    baseDatos=solicitud.result;

    console.log("se abrio correctamente");
    validateHomeUser()
    .then((nombre)=>{
        let element=document.createElement("H1");
        element.classList.add("balance");
        element.innerHTML=`Veterinaria: ${nombre[0]}`;
        containerWelcom.appendChild(element);
        
        containerInformation.innerHTML+=`
        <ul>
        <li><strong>Nombre :</strong>${nombre[0]}</li>
        <li><strong>Nit :</strong>${nombre[1]}</li>
        <li><strong>Correo Suministrado:</strong>${nombre[2]}</li>
        <li><input placeholder="Direccion"></li>
        </ul>`
    })
    .catch((error)=>{
        console.log(error);
    })

    //Evento para cuando cierren sesion desactivar el perfil

    exit.addEventListener("click",(e)=>{
        changeStartedSessionValue()
        .then(()=>{
            window.location.replace("/page2/terceraPagina.html");
        }).catch((err)=>{
            alert("ocurrio un error");
        })
    });

    //zona para agregar ala base de datos los nuevos perfiles veterinarios
   
    getNitVeterinary()   //Debimos hacerlos con promesas ya que simplemente llaman la funcion y obtener el valor que es el nit , no se puede
    .then((nit)=>{     
        let createNewVets= document.querySelector(".createProfile");
        createNewVets.addEventListener("click",(e)=>{
            e.preventDefault();
            addDoctorsInDatabase(nit);
        })
    })
    .catch((e)=>{
        alert(e);
    })


    //zona para mostrar los perfiles veterinarios en pantalla 
    let boolena=false;  //iniciamos una varibale boleana
    getNitVeterinary(baseDatos)
    .then((nit)=>{
        showVeterinarian.classList.add("ocultar");  //añadimos la clase para ocular el background blanco

        viewProfiles.addEventListener("click",(e)=>{
            e.preventDefault();
            if(!boolena){
                viewProfiles.innerHTML="Ocultar Perfiles"  //La primera vez que se presiona el boton se mostraran los veterinarios en pantalla pero y boton cambiara su texto a ocultar perfiles
                showVeterinarian.classList.remove("ocultar");
                showDoctors(nit);
                boolena=true;   //cambiamos el valor boleano de la variable para forzar el otro estado
            }
            else{
                viewProfiles.innerHTML="view perfiles"  //Entramos el otro estado del boton donde lo cambiamos nuevamente 
                showVeterinarian.innerHTML=""; //Y todos los perfiles se borran automaticamente
                showVeterinarian.classList.add("ocultar"); //añadimos la clase que ocultara el background balnco
                boolena=false;
            }
            
        });
    })
    .catch((e)=>{alert("error")})  //mostramos cualquier error e consola
    
}


newVet.addEventListener("click",(e)=>{
    e.preventDefault();
    containerProfiles.classList.toggle("viewForm");
})


equis.addEventListener("click",(e)=>{
    containerProfiles.classList.toggle("viewForm");
});

//_____________________________________________________________

// inicio de funciones

const validateHomeUser=()=>{
    return new Promise((resolve,reject)=>{
        let transaction=baseDatos.transaction("veterinarys");
        let objectStore=transaction.objectStore("veterinarys");
        let cursor=objectStore.openCursor();

        cursor.onsuccess=(e)=>{
            let puntero=e.target.result;
            if(puntero){
                if(puntero.value.veterinaryStart==true){
                    let value=puntero.value;
                    resolve([value.veterinaryName , value.veterinaryNit , value.veterinaryEmail]);
                }
                puntero.continue();
            }
            else{
                reject("No se pudo encontrar la informacion");
            }
        }
    });
}

//_____________________________________________________________



const changeStartedSessionValue=()=>{
    return new Promise((resolve,reject)=>{
        let transaction=baseDatos.transaction("veterynaris","readwrite");
        let objectStore=transaction.objectStore("veterinarys");
        let cursor=objectStore.openCursor();

        cursor.onsuccess=(e)=>{
            let puntero=e.target.result;
            if(puntero){
                let value=puntero.value;
                if(value.veterinaryStart==true){
                    value.veterinaryStart==false;
                    puntero.update(value);
                    resolve();
                }
                puntero.continue();
            }
            else{
                reject("No hay nada activo ");
            }
        }
    });
}

//_____________________________________________________________


const getNitVeterinary=()=>{
    return new Promise((resolve,reject)=>{
        let transaction=baseDatos.transaction("veterinarys");
        let objectStore=transaction.objectStore("veterinarys");
        let cursor=objectStore.openCursor();
        
        cursor.onsuccess=(e)=>{
            let puntero=e.target.result;
            if(puntero){
                if(puntero.value.veterinaryStart==true){
                    resolve(puntero.value.veterinaryNit);
                }
                puntero.continue();
            }
            else{
                reject("No hay nada activo");
            }
        }
    });
}

//_____________________________________________________________



const addDoctorsInDatabase=(nit)=>{
        let name=document.querySelector(".name").value;
        let idDoctor=document.querySelector(".id").value;
        let emailDoctor=document.querySelector(".email").value;
        let passwordDoctor=document.querySelector(".password").value;
        let specialtyDoctorText=document.querySelector(".specialty").value;
        let cityDoctor=document.querySelector(".city").value;

        let transaction=baseDatos.transaction("medical-profiles","readwrite");
        let objectStore=transaction.objectStore("medical-profiles");
        objectStore.add({
            clave : new Date().toISOString(),
            name : name,
            id : idDoctor,
            nitVete:nit,
            email : emailDoctor,
            password : passwordDoctor,
            specialtyDoctor : specialtyDoctorText,
            city : cityDoctor
        });

        let name2=document.querySelector(".name").value="";;
        let idDoctor2=document.querySelector(".id").value="";;
        let emailDoctor2=document.querySelector(".email").value="";;
        let passwordDoctor2=document.querySelector(".password").value="";;
        let specialtyDoctorText2=document.querySelector(".specialty").value="";
        let cityDoctor2=document.querySelector(".city").value="";;
}

//_____________________________________________________________



const showDoctors=(nit)=>{
    let transaction=baseDatos.transaction("medical-profiles");
    let objectStore=transaction.objectStore("medical-profiles");
    let cursor=objectStore.openCursor();

    cursor.onsuccess=(e)=>{
        let puntero=e.target.result;
        if(puntero){
            if(puntero.value.nitVete==nit){
                showVeterinarian.innerHTML+=`
                <div class="carta">
                    <strong>${puntero.value.name}</strong>

                    <img src="/img/blank-avatar-photo-place-holder-600nw-1095249842.webp" class="sinFace">

                    <strong>Especialidad: ${puntero.value.specialtyDoctor}</strong>:
                </div>
                `
            }
        }
    }
}