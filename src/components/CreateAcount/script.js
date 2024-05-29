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


//*main*//
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
    } 
    else {
        
        alert('Registrado con éxito!');
       }
       
   const registerForm = document.getElementById('registerForm');
       registerForm.reset();
});


// ___________________________________________________



class invalidEmail extends Error{
    constructor(message){
        super(message);
    }
}

class badEmailEstructure extends Error{
    constructor(message){
        super(message);
    }
}

class rangeid extends Error{
    constructor(message){
        super(message);
    }
}

class duplicateid extends Error{
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

class duplicateEmail extends Error{
    constructor(message){
        super(message);
    }
}

class improvePassword extends Error{
    constructor(message){
        super(message);
    }
}

/*Elementos html seleccionados para su posterior uso*/ 

let button=document.querySelector(".send");


var solicitud=indexedDB.open("datos");

var baseDatos;



solicitud.onerror=()=>{
    alert("Ocurrio un error ");
}



solicitud.onsuccess=()=>{
    baseDatos=solicitud.result;
    console.log("enbtramos bien");

    button.addEventListener("click",(e)=>{
        e.preventDefault();

        validateName()
        .then((e)=>{

            validateId()
            .then(()=>{

                validateEmail()
                .then(()=>{

                    let aprobado=validatepassword();
                    if(aprobado){
                        mountData()
                        .then(()=>{

                            changeValueEntity()
                            .then(()=>{
                                 window.location.replace("/src/components/login/index.html");
                            })
                            .catch(()=>{

                            })
                        })

                        .catch(()=>{
                            console.log("hubo un error");
                        })
                    }
                })
                //error theree
                .catch((error)=>{
                    document.querySelector(".mistakes").innerHTML=error.message;
                setTimeout(()=>{
                    document.querySelector(".mistakes").innerHTML="";
                },3000);
                    })
             })


             //error two
            .catch((error)=>{
                document.querySelector(".mistakes").innerHTML=error.message
            setTimeout(()=>{
                document.querySelector(".mistakes").innerHTML="";
            },3000);
            })
        })

        //error one
        .catch((error)=>{document.querySelector(".mistakes").innerHTML=error.message;
            setTimeout(()=>{
                document.querySelector(".mistakes").innerHTML="";
            },3000);
        });
 });

}

/*Este codigo se necesita para activar los valores que van a estar en la pagina donde esta para ver en que vamos a iniciar sesion*/


const addInitialValues=()=>{
    let transactionStore=baseDatos.transaction("entity","readwrite");
    let objectStore=transactionStore.objectStore("entity");
    objectStore.add({
        activateVeterinary:false,
        activateDoctor:false,
        activatePatient:false
    });
}




/*FUNCIONES QUE SE EJECUTAN EN EL SUCCESS DE LA BASE DE DATOS*/ 

const validateName=()=>{
    return new Promise((resolve,reject)=>{
        let nameVeterinary=document.querySelector(".name").value;

        if(nameVeterinary.length<3){
            reject(new completeName("Completa el nombre"));
        }

        else{
            let transaction=baseDatos.transaction("veterinarys");
            let objectStore=transaction.objectStore("veterinarys");
            let cursor=objectStore.openCursor();
            cursor.addEventListener("success",(e)=>{
            let puntero=e.target.result;
            if(puntero){
                if(puntero.value.veterinaryName==nameVeterinary){
                    reject(new duplicateEmail("El name de la veterinaria ya esta en uso"));
                }
                puntero.continue();
            }
            else{
                resolve("bin");
            }
        });
        }
        
    });

}


const validateId=()=>{

    return new Promise((resolve,reject)=>{

    let id=document.querySelector(".id").value;
    let transaction=baseDatos.transaction("veterinarys");

    let openStore=transaction.objectStore("veterinarys");

    
    let indice=openStore.index("veterinaryNitIndex");

    let rango=IDBKeyRange.only(id);

    let cursor=indice.openCursor(rango);

    let containNumber=false;
    for(x of id){
        if(isNaN(x)){
            containNumber=true;
        }
    }

    if(id.length<=8 || id.length>9 || containNumber){
        reject(new rangeid("En el nit pon la cantidad de numeros correctamente y ninguna letra"));
    }
    else{
        cursor.addEventListener("success",(e)=>{
            let puntero=e.target.result;
            if(puntero){
                if(puntero.value.veterinaryNit==id){
                   reject(new duplicateid("El Nit ya esta en el sistema"))
                   return;
                }
                puntero.continue();
            }
            resolve();
        });
    }

    
    });
    
}




const estructuras=["@gmail.com","@hotmail.com","@yahoo.com"]
const validateEmail=()=>{

    return new Promise((resolve,reject)=>{
        let email=document.querySelector(".email").value;
        let transaction=baseDatos.transaction("veterinarys");
        let openStore=transaction.objectStore("veterinarys");

        let indice=openStore.index("EmailVeterinaryIndex");
        let rango=IDBKeyRange.only(email);
        let cursor=indice.openCursor(rango);

        let indiceArroba=email.indexOf("@");
        let estructura=email.substring(indiceArroba,222);


        if(email.length<13){
            reject(new datesInvalid("Por favor llena los campos correctamente"))
        }

        else if(!estructuras.includes(estructura)){
            reject(new badEmailEstructure("Tu email no tiene la estructura correcta"));
        }

        else if(email.length>13 && estructura.includes(estructura)){

            cursor.addEventListener("success",(e)=>{
                let puntero=e.target.result;
    
                if(puntero){
    
                    if(puntero.value.veterinaryEmail==email){
                        reject(new duplicateEmail("El email ya esta registrado"));
                    }
    
                    puntero.continue();
                }
                resolve();
            });
        }
        
    });
}





const validatepassword=()=>{
        let passwordVeterinary=document.querySelector(".password").value;
        let passwordVeterinary2=document.querySelector(".password2").value;

        try{
            let quantityNumbers=0;
            let mayusculas=0;
            for(x of passwordVeterinary){
                let conversion=parseInt(x);
                if(x == x.toUpperCase() && isNaN(conversion)){
                    mayusculas++;
                }
                else if(!isNaN(conversion)){
                    quantityNumbers++;
                }
            }

            if(mayusculas>=1 && quantityNumbers>=3){
                
                if(passwordVeterinary===passwordVeterinary2){
                    return true;
                }    
                else{
                    throw new datesInvalid("Las contraseñas no coinciden");
                }
            
            }
            else{
               
                throw new improvePassword("La contraseña debe contener minimamente una letra mayuscula y mas de 2 numeros");
            }
        }
       

        catch(error){
            if(error instanceof improvePassword){
                document.querySelector(".mistakes").innerHTML=error.message;
                setTimeout(()=>{
                    document.querySelector(".mistakes").innerHTML="";
                },5000);
            }

            else if(error instanceof datesInvalid){
                document.querySelector(".mistakes").innerHTML=error.message;
                setTimeout(()=>{
                    document.querySelector(".mistakes").innerHTML="";
                },5000);
            }
        }
}




// ____________________________________





const mountData=()=>{
    return new Promise((resolve,reject)=>{
        let name=document.querySelector(".name").value;
        let email=document.querySelector(".email").value;
        let id=document.querySelector(".id").value;
        let adress=document.querySelector(".adress").value;
        let city=document.querySelector(".city").value;
        let phone=document.querySelector(".phone").value;
        let representative = document.querySelector("#representative").value;
        let passwordVeterinary=document.querySelector(".password").value;
        let transaction=baseDatos.transaction("veterinarys","readwrite");
        let openStore=transaction.objectStore("veterinarys");
        let clock=new Date();
    
        openStore.add({
            id:clock.toISOString(),
            veterinaryName:name,
            veterinaryEmail:email,
            veterinaryNit:id,
            veterinaryPassword:passwordVeterinary,
            veterinaryStart:false,
            veterinaryAdress:adress,
            veterinaryPhone:phone,
            veterinaryCity:city,
            veterinaryRepresentative: representative,
            urlPhotoVeterinary:""
        });
    
        let name2=document.querySelector(".name").value="";
        let email2=document.querySelector(".email").value="";
        let id2=document.querySelector(".id").value="";
        let password2=document.querySelector(".password").value="";
        let adress2=document.querySelector(".adress").value="";
        let city2=document.querySelector(".city").value="";
        let phone2=document.querySelector(".phone").value="";
        document.querySelector("#representative").value=""
        transaction.oncomplete=()=>{
            resolve();
        }

        transaction.onerror=()=>{
            reject();
        }
    });

}



// __________________________________________

const changeValueEntity=()=>{
    return new Promise((resolve,reject)=>{
        let transaction=baseDatos.transaction("entity","readwrite");
        let openStore=transaction.objectStore("entity");
        let cursor=openStore.openCursor();

        transaction.oncomplete=()=>{
            resolve();
        }

        transaction.onerror=()=>{
            reject();
        }

        let cursorStopped=false;
        cursor.onsuccess=(e)=>{
            let puntero=e.target.result;
            if(puntero && !cursorStopped){
                if(puntero.value.activateVeterinary==false){
                    let values=puntero.value;
                    values.activateVeterinary=true;
                    puntero.update(values);
                    cursorStopped=true;
                }
            }
        }
    });
}



/*ESTA ES LA ZONA DE profile QUE EL USUARIO YA TIENE */


//ELEMENTOS HTML


