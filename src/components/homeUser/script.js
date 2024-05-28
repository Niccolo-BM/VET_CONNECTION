// page header and footer script
let icon=document.querySelector(".material-symbols-outlined");
let menuHidden=document.querySelector(".menuHidden");
let searchHidden=document.querySelector(".searchHidden");
let body=document.querySelector(".body");

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


//main
import { 
    showPhotoInContainer ,
    readFile ,
    changeUrlPhoto ,
    validateloginUser ,
    changeStartedSessionValue ,
    idPet ,returnActivePet, 
    deletePet,
    viewMedicalHistory,
    changeValueEntity
} from "/services/servicesMedic.js";


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

let containerDeleteProfiles=document.querySelector(".containerDeleteProfiles"); //formulario desplegable para create nuevo veterinaria

// let containerPatients=document.querySelector(".containerPatients");//container donde se mostraran sus profiles

let viewHistory=document.querySelector(".viewHistory"); // bottom de create profiles

let equis=document.querySelector(".equis");


let viewMenu=document.querySelector(".viewMenu"); //bottom para view profiles


let optionsNav=document.querySelector(".containerOptions");


let deletePatientNow=document.querySelector(".patientsDelete");

let changePhoto=document.querySelector(".photo");

let containerPhoto=document.querySelector(".containerPhoto");

let inputPhoto=document.querySelector(".inputPhoto");

let buttonForDelete=document.querySelector(".acept");

let buttonForReturnDelete=document.querySelector(".cancel");






//Eventos y demas cosas que involucren la base de datos


let solicitud=indexedDB.open("datos");
var baseDatos;
solicitud.onsuccess=function(){
    
    baseDatos=solicitud.result;
    
    console.log("todo bien");

    // dataDoctor();

    // dataVete()
    // dataPet();


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
            containerPhoto.innerHTML=`<img src='${url}'  class="show" alt='Pon una foto'>`;
        })
        .catch((err)=>{alert(err);});


    //______________________________________________
    
    validateloginUser(baseDatos)  //Activamos funcion para extraer del medico:nombre,id,correo,Numero nit 
    .then((information)=>{  //information equivale a todo lo antes dichos envuelto en una array
      
        
        containerInformation.innerHTML+=`
        <ul>
        <li><strong>Nombre : </strong>${information[0]}</li>
        <li><strong>Cargo : </strong>${information[0]}</li>
        <li><strong>Correo asignado:</strong>${information[1]}</li>
        <li><strong>password Asignada : </strong>${information[2]}</li>
        <li><strong>password Asignada : </strong>asdas</li>
        <li><strong>password Asignada : </strong>sadas</li>
        </ul>`
       
    })
    .catch((error)=>{
        if(error instanceof EmailNotFound){
            console.log(error.message);
        }
    })
    

    //______________________________________________


    //Evento para cuando cierren sesion desactivar el perfil
    
    exit.addEventListener("click",(e)=>{
        changeStartedSessionValue(baseDatos)
        .then(()=>{

            changeValueEntity(baseDatos)
            .then(()=>{
                window.location.replace("/nuevo prototipo/Acces.html");
            })
            .catch()

        }).catch((err)=>{
            console.log(err);
        })
    });
    
   
    //______________________________________________
    

    // Eventos encargados para que todo lo que tenga que ver con cambio de foto salga bien
  
inputPhoto.addEventListener("change",(e)=>{
    let question=confirm("Quieres establecer esta foto?");
    if(question){   
        readFile(inputPhoto.files[0])           //mandamos como parametro el primer archiv seleccionado 
        .then((url)=>{
            changeUrlPhoto(baseDatos,url)     //Esta funcion le pasamos como parametro url de la imagen para que haga la actualizacion
            .then(()=>{
                // alert(url);
                location.reload();
            })
            .catch((err)=>alert("No se pudo cambiar la foto "))
            
        })
        .catch();
    }
});


returnActivePet(baseDatos)
.then((dates)=>{
   let container=document.querySelector(".containerFeed");

   viewMedicalHistory(baseDatos,dates[0],dates[1])
   .then((data)=>{          
        container.classList.add("viewClinicalHistory");
        container.innerHTML=data;
   })

   .catch(()=>{
        container.innerHTML=`<h1>Hasta el momento no hay historias clinicas para mostrar</h1>`
   });
})
.catch(()=>{
    alert("no hay nada");
});




}




//EVENTOS



//Pequeño evento para desplegar el formulario para create un nuevo vet


deletePatientNow.addEventListener("click",(e)=>{
    optionsNav.classList.remove("viewOptions");
    containerDeleteProfiles.classList.toggle("viewForm"); //al contenedor con display none le damos una nuevo clase
});


equis.addEventListener("click",(e)=>{
    containerDeleteProfiles.classList.toggle("viewForm");
});


viewMenu.addEventListener("click",(e)=>{
    e.preventDefault();
    optionsNav.classList.toggle("viewOptions");
    containerDeleteProfiles.classList.remove("viewForm");
});


changePhoto.addEventListener("click",(e)=>{
    inputPhoto.click();
});



containerPhoto.addEventListener("click",(e)=>{
    inputPhoto.click();

});

viewHistory.addEventListener("click",()=>{
    document.querySelector(".goHistory").click();
});




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
            start:true,
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
            startProfile:true,
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
        veterinaryStart : true,
        urlPhotoVeterinary:""
    });
}