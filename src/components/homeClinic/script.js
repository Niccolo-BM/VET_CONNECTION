import{
  readFile,
  notFoundId,
  EmailNotFound,

}

from "/services/servicesMedic.js"

// let db;
// let url = new URL(document.URL);
// let search_params = url.searchParams; 
// let vetId = search_params.get("id");
// function initDB(){
//     let request = indexedDB.open("datos")

//     request.addEventListener("error", ShowError);
//     request.addEventListener("success", Start);
//     request.addEventListener("upgradeneeded", CreateStores);
// }

// function ShowError(e){
//   alert(`DB error: 
//           code: ${e.code}
//           message: ${e.message}`);
// }

// function Start(e){
//   db = e.target.result;
//   openDBCursor();
// }

// function CreateStores(e){
//   let dataBase = e.target.result;

//   let vetStore = dataBase.createObjectStore("Veterinary", {keyPath: "id", autoIncrement: true});
//   vetStore.createIndex("Veterinary", "id", {unique: true});

//   let DoctorStore = dataBase.createObjectStore("Doctor", {keyPath: "id", autoIncrement: true});
//   DoctorStore.createIndex("Doctor", "id", {unique: true});
// }

// function openDBCursor(){
//   let transaction = db.transaction(["Veterinary"], "readwrite");
//   let store = transaction.objectStore("Veterinary");
//   let cursor = store.openCursor();
//   cursor.addEventListener("success", showVeterinaryData);
// }

// function updateVeterinary(){
//   let id = vetId;
//   let name = document.querySelector("#updateName").value;
//   let address = document.querySelector("#updateAddress").value;
//   let city = document.querySelector("#updateCity").value;
//   let nit = document.querySelector("#updateNit").value;
//   let phone = document.querySelector("#updatePhone").value;
//   let services = document.querySelector("#updateServices").value;
//   let representative = document.querySelector("#updateRepresentative").value;

//   let transaction = db.transaction(["Veterinary"], "readwrite");
//   let store = transaction.objectStore("Veterinary");

//   store.put({
//       id: parseInt(id),
//       name: name,
//       address: address,
//       city: city,
//       nit: nit,
//       phone: phone,
//       services: services,
//       representative: representative
//   });

//   let cursor = store.openCursor();
//   cursor.addEventListener("success", showVeterinaryData);
// }

// function loadDoctorSlider(){
//   let cursor = e.target.result;

//   if (cursor){
    
//     cursor.continue();
//   }

// } 

// function showVeterinaryData(e){
//   let cursor = e.target.result;

//   if (cursor){
//     if (cursor.value.id == vetId){
//       document.querySelector("#Name").innerHTML = cursor.value.name;
//       document.querySelector("#Address").innerHTML = cursor.value.address;
//       document.querySelector("#City").innerHTML = cursor.value.city;
//       document.querySelector("#Nit").innerHTML = cursor.value.nit;
//       document.querySelector("#Phone").innerHTML = cursor.value.phone;
//       document.querySelector("#Services").innerHTML = cursor.value.services;
//       document.querySelector("#Representative").innerHTML = cursor.value.representative;
//       document.querySelector("#updateName").value = cursor.value.name;
//       document.querySelector("#updateAddress").value = cursor.value.address;
//       document.querySelector("#updateCity").value = cursor.value.city;
//       document.querySelector("#updateNit").value = cursor.value.nit;
//       document.querySelector("#updatePhone").value = cursor.value.phone;
//       document.querySelector("#updateServices").value = cursor.value.services;
//       document.querySelector("#updateRepresentative").value = cursor.value.representative;
//     }
//     cursor.continue();
//   }
// }

// function saveDoctor(){
//   let name = document.querySelector("#NameDoctor").value;
//   let position = document.querySelector("#PositionDoctor").value;
//   let spec = document.querySelector("#SpecDoctor").value;
//   let city = document.querySelector("#CityDoctor").value;
//   let clinic = document.querySelector("#ClinicDoctor").value;

//   let transaction = db.transaction(["Doctor"], "readwrite");
//   let store = transaction.objectStore("Doctor");

//   store.put({
//       name: name,
//       position: position,
//       spec: spec,
//       city: city,
//       clinic: clinic,
//       veterinary: vetId
//   });

//   document.querySelector("#NameDoctor").value = "";
//   document.querySelector("#PositionDoctor").value = "";
//   document.querySelector("#SpecOption").selected = true;
//   document.querySelector("#CityDoctor").value = "";
//   document.querySelector("#ClinicDoctor").value = "";

//   cursor.addEventListener("success", loadDoctorSlider);
// }

let inputPhoto=document.querySelector(".photoClinic");

let containerPhoto=document.querySelector("#divProfile");


let otherOptionChange1=document.querySelector(".left");
let otherOptionChange2=document.querySelector(".left2");

let delete1=document.querySelector(".delete1");
let delete2=document.querySelector(".delete2");

let exit=document.querySelector("#exit");

let buttonForDelete=document.querySelector(".acept");
let buttonForReturnDelete=document.querySelector(".cancel");

let buttonCreator=document.querySelector("#BtnCreateDoctor");

let iconSearch=document.querySelector("#searchIcon");

// start db
var db;

var solicitud=indexedDB.open("datos");

solicitud.onerror=()=>{
  console.log("Error");
}


solicitud.onsuccess=()=>{
  db=solicitud.result;
  console.log("todo perfecto");


  
  showPhotoInContainer()
  .then((url)=>{
      containerPhoto.innerHTML=`<img src='${url}'  class="show" alt='Poner una foto'>`;
  })
  .catch((err)=>{alert(err);});


// ________________________________________________

  validateHomeUser()
  .then(()=>{})
  .catch();
// ________________________________________________




buttonForDelete.addEventListener("click",()=>{
  idVet()
  .then((id)=>{
      deleteVet(id)
      .then(()=>{
          window.location.replace("/src/components/accessPage/index.html");;
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

// ________________________________________________

  
    // Eventos encargados para que todo lo que tenga que ver con cambio de foto salga bien
  
inputPhoto.addEventListener("change",(e)=>{
  let question=confirm("Quieres establecer esta foto?");
  if(question){   
      readFile(inputPhoto.files[0])           //mandamos como parametro el primer archiv seleccionado 
      .then((url)=>{
          changeUrlPhoto(url)     //Esta funcion le pasamos como parametro url de la imagen para que haga la actualizacion
          .then(()=>{
              // alert(url);
              location.reload();
          })
          .catch((err)=>alert("No se pudo cambiar la foto "))
          
      })
      .catch();
  }
});

// ________________________________________________

obtainIdVet()
.then((nit)=>{
  let containerDoctors=document.querySelector(".slider-wrapper");
  showMedics(nit)
  .then((data)=>{
    containerDoctors.innerHTML="";
    containerDoctors.innerHTML=data;
  })
  .catch(()=>{
    containerDoctors.innerHTML=`<h1>No hay medicos registrados</h1>`;
  });
})
.catch();


obtainIdVet()
.then((nit)=>{
  buttonCreator.addEventListener("click",(e)=>{
    createProfileMedic(nit)
    .then(()=>{
      location.reload();
    })
    .catch(()=>{
      console.log("SALIO  MAL");
    });
  });

})
.catch();

// ________________________________________________


iconSearch.addEventListener("click",()=>{
  let containerDoctors=document.querySelector(".slider-wrapper");
  obtainIdVet()
  .then((nit)=>{
    searchProfiles(nit)
    .then()
    .catch(()=>{
      containerDoctors.innerHTML=`<h1>EL medico no esta registrado</h1> `
    });
  })
  .catch();
});









// ________________________________________________

    //Evento para cuando cierren sesion desactivar el perfil
    
    exit.addEventListener("click",(e)=>{
      changeStartedSessionValue()
      .then(()=>{
          window.location.replace("/src/components/accessPage/index.html");
      }).catch((err)=>{
          alert(err);
      })
  });


}


// Start functions

const validateHomeUser=()=>{
  return new Promise((resolve,reject)=>{
      let transaction=db.transaction("veterinarys");
      let objectStore=transaction.objectStore("veterinarys");
      let cursor=objectStore.openCursor();

      cursor.onsuccess=(e)=>{
          let puntero=e.target.result;
          if(puntero){
              if(puntero.value.veterinaryStart==true){
                  let value=puntero.value;
                  document.querySelector("#Name").innerHTML = puntero.value.veterinaryName;
                  document.querySelector("#Address").innerHTML = puntero.value.veterinaryAdress;
                  document.querySelector("#City").innerHTML = puntero.value.veterinaryCity;
                  document.querySelector("#Nit").innerHTML = puntero.value.veterinaryNit;
                  document.querySelector("#Phone").innerHTML = puntero.value.veterinaryPhone;
                  // transaction.oncomplete=()=>{
                  //   resolve([value.veterinaryName , value.veterinaryAdress , value.veterinaryCity,value.veterinaryNit,value.veterinaryPhone]);
                  // }
                  resolve();

              }
              puntero.continue();
          }
          else{
              reject("No se pudo encontrar la informacion");
          }
      }
  });
}

// ________________________________________________


const showPhotoInContainer=()=>{
  return new Promise((resolve,reject)=>{
      let transaction=db.transaction("veterinarys");
      let objectStore=transaction.objectStore("veterinarys");
      let cursor=objectStore.openCursor();

      cursor.onsuccess=(e)=>{
          let puntero=e.target.result;
          if(puntero){
              if(puntero.value.veterinaryStart==true){
                  resolve(puntero.value.urlPhotoVeterinary);
              }                                                   //EXPORTAR
              puntero.continue();
          }
          else{
              reject("no hay ninguna url");
          }
      }
  });
}

// ________________________________________________



const changeUrlPhoto=(url)=>{
  return new Promise((resolve,reject)=>{
      let transaction=db.transaction("veterinarys","readwrite");
      let objectStore=transaction.objectStore("veterinarys");
      let cursor=objectStore.openCursor();

      cursor.onsuccess=(e)=>{
          let puntero=e.target.result;
          if(puntero){
              if(puntero.value.veterinaryStart==true){              //EXPORTAR
                  let valueChange=puntero.value;
                  valueChange.urlPhotoVeterinary=url;
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

// ________________________________________________




const changeStartedSessionValue=()=>{
  return new Promise((resolve,reject)=>{
  let transaccionFalse=db.transaction("veterinarys","readwrite");
  let objetStore=transaccionFalse.objectStore("veterinarys");


  transaccionFalse.oncomplete=()=>{
    resolve();
  }

  transaccionFalse.onerror=()=>{
    reject("No se encontro");
  }

  let cursor=objetStore.openCursor();

  let cursorStopped=false;

  cursor.addEventListener("success",(e)=>{
      let puntero=e.target.result;
      if(puntero && !cursorStopped){
          let valor=puntero.value;
          if(valor.veterinaryStart==true){
              valor.veterinaryStart = false; // Modificar la propiedad inicio a true
              puntero.update(valor); 
              cursorStopped=true;
          }
          puntero.continue();
     }    
  });
  });
}

// ________________________________________________

const idVet=()=>{
  return new Promise((resolve,reject)=>{
      let transaction=db.transaction("veterinarys");
      let objectStore=transaction.objectStore("veterinarys");
      let cursor=objectStore.openCursor();
                                                                      //EXPORTAR
      cursor.onsuccess=(e)=>{
          let puntero=e.target.result;
          if(puntero){
              if(puntero.value.veterinaryStart==true){
                  resolve(puntero.key);
              }
              puntero.continue();
          }
      }
  });
}

// ________________________________________________


const deleteVet=(id)=>{
  return new Promise((resolve,reject)=>{
      let transaction=db.transaction("veterinarys","readwrite");
      let objectStore=transaction.objectStore("veterinarys");
       objectStore.delete(id);    

       transaction.oncomplete=()=>{
          resolve();
       }

       transaction.onerror=()=>{
          reject();
       }
  });                                      //EXPORTAR
}


// ________________________________________________


const updateData=()=>{
  return new Promise((resolve,reject)=>{
    let name=document.querySelector(".updateName");
    let address=document.querySelector(".updateAddress");
    let city=document.querySelector(".updateCity");
    let Nit=document.querySelector(".updateNit");
    let phone=document.querySelector(".updatePhone");
    let transaction=db.transaction("veterinarys","readwrite");
    let openStore=transaction.objectStore("veterinarys");

    let cursor=openStore.openCursor();

    cursor.addEventListener("click",(e)=>{
      let puntero=e.target.result;
      if(puntero){
        if(puntero.value.veterinaryStart==true){
          let value2=puntero.value;
          value2.veterinaryName=name;
          value2.veterinaryAdress=address;
          value2.veterinaryCity=city;
          value2.veterinaryPhone=phone;
          value2.veterinaryNit=Nit;

          transaction.oncomplete=()=>{
            puntero.update(value2);
            resolve();
          }
        }
      }

    })
  });
}

// ________________________________________________


const createProfileMedic=(NitVeterinary)=>{
  return new Promise((resolve,reject)=>{
    let name=document.querySelector("#NameDoctor").value;
    let specialty=document.querySelector("#SpecDoctor").value;
    let cityDoctor=document.querySelector("#CityDoctor").value;
    let emailDoctor=document.querySelector("#emailDoctor").value;
    let idDoctor=document.querySelector("#idDoctor").value;

    let transaction=db.transaction(["medical-profiles"],"readwrite");
    let objectStore=transaction.objectStore("medical-profiles");


    objectStore.add({
      name:name,
      specialtyDoctor:specialty,
      city:cityDoctor,
      id:idDoctor,
      start:false,
      email:emailDoctor,
      nitVete:NitVeterinary,
      urlPhotoDoctor:""
    });


    let name2=document.querySelector("#NameDoctor").value="";
    let specialty2=document.querySelector("#SpecDoctor").value="";
    let cityDoctor2=document.querySelector("#CityDoctor").value="";
    let clinic2=document.querySelector("#ClinicDoctor").value="";
    let emailDoctor2=document.querySelector("#emailDoctor").value="";
    let idDoctor2=document.querySelector("#idDoctor").value="";
    
    transaction.oncomplete=()=>{
      resolve();
    }
    transaction.onerror=()=>{
      reject();
    }

  });
}

// ________________________________________________


const result=[];
const showMedics=(nit)=>{
  return new Promise((resolve,reject)=>{
    let transaction=db.transaction("medical-profiles");
    let objectStore=transaction.objectStore("medical-profiles");

    let cursor=objectStore.openCursor();
    let count=0;

    cursor.onsuccess=(e)=>{
      let puntero=e.target.result;
      if(puntero){
        if(puntero.value.nitVete==nit){
          const resultHTML=`
          <div class="doctorCard">

          <div class="containerOptionsProfiles">
          <p>Eliminar Perfil</p>
          <p>Actualizar Perfil</p>
          </div>

          <section class="doctorSection doctorSection-top">
              <i class="fa fa-bars doctorMenu"></i>
              <p>${puntero.value.name}</p>
          </section>

          <section class="doctorSection">
              <img src="${puntero.value.urlPhotoDoctor}" alt="Sin foto" class="show2">
          </section>

       

          <section class="doctorSection doctorSection-bottom">
              ${puntero.value.specialtyDoctor}
          </section>

        </div>
          `;
          count++;
            result.push(resultHTML);
        }
        puntero.continue();
      }
      else if(count==0){
        reject();
      }
      else{
        resolve(result.reverse());
      }

    }
  })
}



// ________________________________________________



const obtainIdVet=()=>{
  return new Promise((resolve,reject)=>{
    let transaction=db.transaction("veterinarys");
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
        reject("Error");
      }
    }
  })
}
// ________________________________________________



const searchProfiles=(nitVete)=>{
  return new Promise((resolve,reject)=>{
    let inputSearch=document.querySelector("#inputSearch").value;
    let transaction=db.transaction("medical-profiles");
    let objectStore=transaction.objectStore("medical-profiles");
    let cursor=objectStore.openCursor();

    

    cursor.onsuccess=(e)=>{ 
      let puntero=e.target.result;
      let containerDoctors=document.querySelector(".slider-wrapper");
      if(puntero){
        if(puntero.value.nitVete===nitVete && puntero.value.id==inputSearch){
          containerDoctors.innerHTML=`
          <div class='doctorCard ${puntero.value.id}'>

          <div class="containerOptionsProfiles">
          <p class="deleteMedic">Eliminar Perfil</p>
          <p class="updateMedic">Actualizar Perfil</p>
          </div>

          <section class="doctorSection doctorSection-top">
              <i class="fa fa-bars doctorMenu"></i>
              <p>${puntero.value.name}</p>
          </section>

          <section class="doctorSection">
              <img src="${puntero.value.urlPhotoDoctor}" alt="Sin foto" class="show2">
          </section>

          <section class="doctorSection doctorSection-bottom">
              ${puntero.value.specialtyDoctor}
          </section>

        </div>
          `
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
// ________________________________________________









// ________________________________________________

containerPhoto.addEventListener("click",()=>{
  inputPhoto.click();
});



otherOptionChange1.addEventListener("click",()=>{
  inputPhoto.click();

});

otherOptionChange2.addEventListener("click",()=>{
  inputPhoto.click();

});


delete1.addEventListener("click",()=>{
  document.querySelector(".containerDeleteProfiles").classList.toggle("viewForm");

});

delete2.addEventListener("click",()=>{
  document.querySelector(".containerDeleteProfiles").classList.toggle("viewForm");
});


let containerDoctors=document.querySelector(".slider-wrapper");

containerDoctors.addEventListener("click",(e)=>{

  let viewOptionsProfile=document.querySelector(".containerOptionsProfiles");
  let event=e.target;
  let parent=event.parentElement;
  let parent2=parent.previousElementSibling;
 
  if(event.className.includes("fa-bars")){
    parent2.classList.toggle("viewOptionsProfile");
  }

});


// let body2=document.querySelector(".body");

// body2.addEventListener("click",(e)=>{
//   alert(e.clientX + " Y EL VERTICAL ES " + e.clientY) ;
// });















//Header y footer

let icon = document.querySelector(".material-symbols-outlined");
let menuHidden = document.querySelector(".menuHidden");
let searchHidden = document.querySelector(".searchHidden");
let body = document.querySelector(".body");

icon.addEventListener("click", (e) => {
  menuHidden.classList.toggle("viewMenu");
  searchHidden.classList.remove("viewSearch");
});

let search = document.querySelector(".material-symbols-outlined1");

search.addEventListener("click", (e) => {
  menuHidden.classList.remove("viewMenu");
  searchHidden.classList.toggle("viewSearch");
});


//CLINIC PROFILE
//Section 1
// OPEN SUBMENU
//Add a click event to the browser window that triggers a function with the window information in the "e" parameter.
window.addEventListener("click", function (e) {
  let gridSubMenu = document.getElementById("gridSubMenu");
  //If the click target is menuIcon then enter the if statement.
  if (document.getElementById("menuIcon").contains(e.target)) {
    gridSubMenu.style.display = "grid";
    gridSubMenu.addEventListener("transitionend", () => {
      gridSubMenu.style.display = "grid";
    });
    //Get the width of gridSubMenu and if is equal to 8 then enter the if statement.
    if (gridSubMenu.offsetWidth == 4) {
      //Change the value of the width in gridSubmenu to 115%.
      gridSubMenu.style.width = "115%";
    }
    //If the width the gridSubmenu is different than 8 enter the else statement.
    else {
      //Change the value of the width in gridSubmenu for 1%.
      gridSubMenu.addEventListener("transitionend", () => {
        gridSubMenu.style.display = "none";
      });
      gridSubMenu.style.width = "1%";
    }
    //If the click target is not menuIcon the enter the else statement.
  }
  //If the click target is not gridSubMenu, enter the if statement.
  else if (!gridSubMenu.contains(e.target)) {
    //Change the value of the width in gridSubmenu for 1%.
    gridSubMenu.addEventListener("transitionend", () => {
      gridSubMenu.style.display = "none";
    });
    gridSubMenu.style.width = "1%";
  }
});

//Event Search Pet
let searchPetClinicArray = document.querySelectorAll(".eventSearchPet");
searchPetClinicArray.forEach(function (searchPetClinic) {
  searchPetClinic.addEventListener("click", (e) => {
    let showDiv = document.getElementById("searchPet");
    if (showDiv.style.display === "none") {
      showDiv.style.display = "block";
    } else {
      showDiv.style.display = "none";
    }
  });
});

//Close Search Pet
let closeSearchPet = document.querySelector("#closeSearchPet");
closeSearchPet.addEventListener("click", (e) => {
  let searchPet = document.querySelector("#searchPet");
  searchPet.style.display = "none";
});

let closeCreateDoctor = document.querySelector("#closeCreateDoctor");
closeCreateDoctor.addEventListener("click", (e) => {
  let createDoctor = document.querySelector("#createDoctorForm");
  createDoctor.style.display = "none";
});

let createDoctor = document.querySelector("#createDoctor");
createDoctor.addEventListener("click", (e) => {
  let createDoctorForm = document.querySelector("#createDoctorForm");
  createDoctorForm.style.display = "block";
});

let updateButton = document.querySelector("#updateButton");
updateButton.addEventListener("click", (e) => {
  let vetFields = document.querySelectorAll(".vetFields");
  vetFields.forEach(function (element) {
    element.style.display = "none";
  });

  let updateFields = document.querySelectorAll(".updateFields");
  updateFields.forEach(function (element) {
    element.style.display = "block";
  });

  updateButton.style.display = "none";

  let saveVetButton = document.querySelector("#saveVetButton");
  saveVetButton.style.display = "block";
});

let saveVetButton = document.querySelector("#saveVetButton");
saveVetButton.addEventListener("click", (e) => {
  let vetFields = document.querySelectorAll(".vetFields");
  vetFields.forEach(function (element) {
    element.style.display = "block";
  });

  let updateFields = document.querySelectorAll(".updateFields");
  updateFields.forEach(function (element) {
    element.style.display = "none";
  });

  updateButton.style.display = "block";
  saveVetButton.style.display = "none";

  updateVeterinary();
});

