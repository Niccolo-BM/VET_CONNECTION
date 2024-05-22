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

let boton =document.querySelector(".send");




let solicitud=indexedDB.open("datos");  //Solicitud de apertura de la base de datos con el nombre indicado

var baseDatos;


solicitud.onerror=()=>{
    alert("Ocurrio un error");
}

solicitud.onsuccess=()=>{
    baseDatos=solicitud.result;
    console.log("Base de datos abierta");

    boton.addEventListener("click",(e)=>{
        e.preventDefault();

        validateEmail()
        .then(()=>{
            changeStartedSessionValue()
            .then(()=>{
                document.querySelector(".page3").click();
            })
            .catch((e)=>{alert(e.message);});
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

        let transaccion=baseDatos.transaction("medical-profiles");
        let objetStore=transaccion.objectStore("medical-profiles");

        let indice=objetStore.index("emailIndex");

        let rango=IDBKeyRange.only(email);

        let cursor=indice.openCursor(rango);
        let correoEncontrado=false;

        cursor.addEventListener("success",(e)=>{
            let puntero=e.target.result;

            if(puntero){
                correoEncontrado=true;
                if(puntero.value.password==password){
                    resolve();
                    return;
                }else{
                    reject(new incorrectPassword("La password Incorrecta"));
                }
            }
            else{
                reject(new EmailNotFound("El correo no corresponde a ningun medico"));
        }

        })
    })
}

/*
correo--> juan@gmail.com

password---> 1020222D
*/

const changeStartedSessionValue=()=>{
    return new Promise((resolve,reject)=>{
        let email=document.querySelector(".email").value;
    let transaccion=baseDatos.transaction("medical-profiles","readwrite");
    let objetStore=transaccion.objectStore("medical-profiles");

    let cursor=objetStore.openCursor();

    cursor.addEventListener("success",(e)=>{
        let puntero=e.target.result;
        if(puntero){
            let valor=puntero.value;
            if(valor.email==email){
                valor.start = true; // Modificar la propiedad inicio a true
                puntero.update(valor); 
                resolve();
            }
            puntero.continue();
        }
            else{
            reject(new EmailNotFound("El correo no existe"));
        }
    
    });
    });
}