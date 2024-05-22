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



/*ZONA DE ELEMENTOS HTML*/

let botton =document.querySelector(".send");




let solicitud=indexedDB.open("datos");  //Solicitud de apertura de la base de datos con el nombre indicado

var baseDatos;


solicitud.onerror=()=>{
    alert("Ocurrio un error");
}

solicitud.onsuccess=()=>{
    baseDatos=solicitud.result;
    console.log("Base de datos abierta");

    botton.addEventListener("click",(e)=>{
        e.preventDefault();

        validateEmail()
        .then(()=>{
            changeLoggedInValue()
            .then(()=>{
                document.querySelector(".page3").click();
            })
            .catch((e)=>{
                alert(e.message);
            })
            // .then(()=>{
            // })
            // .catch((error)=>{
            //     let solo=document.querySelector(".mistakes").innerHTML=error.message;
            // setTimeout(()=>{
            //     document.querySelector(".mistakes").innerHTML="";
            // },2000);
            // })
        })

        .catch((error)=>{
            let solo=document.querySelector(".mistakes").innerHTML=error.message;
            setTimeout(()=>{
                document.querySelector(".mistakes").innerHTML="";
            },2000);
        })
    })

}







const validateEmail=()=>{
    return new Promise((resolve,reject)=>{
        let email=document.querySelector(".email").value;
        let password=document.querySelector(".password").value;

        let transaccion=baseDatos.transaction("veterinarys");
        let objetStore=transaccion.objectStore("veterinarys");

        // let indice=objetStore.index("veterinaryNitIndex");

        // let rango=IDB.only(email);

        let cursor=objetStore.openCursor();
        let emailEncontrado=false;

        cursor.addEventListener("success",(e)=>{
            let puntero=e.target.result;
            
            if(puntero){
               
                emailEncontrado=true;
                if(puntero.value.veterinaryPassword==password && puntero.value.veterinaryEmail==email){
                    alert("resolveimos");
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

/*
email--> juan@gmail.com

password---> 1020222D
*/

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