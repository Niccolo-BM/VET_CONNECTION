import { readFile, getUrlParams } from "../../../services/servicesMedic.js";

let inputPhoto = document.querySelector(".photoClinic");

let containerPhoto = document.querySelector("#divProfile");

let otherOptionChange1 = document.querySelector(".left");
let otherOptionChange2 = document.querySelector(".left2");

let delete1 = document.querySelector(".delete1");
let delete2 = document.querySelector(".delete2");

let exit = document.querySelector("#exit");

let buttonForDelete = document.querySelector(".acept");
let buttonForReturnDelete = document.querySelector(".cancel");

let buttonCreator = document.querySelector("#BtnCreateDoctor");

let iconSearch = document.querySelector("#searchIcon");

// start db
var db;

var solicitud = indexedDB.open("datos");

solicitud.onerror = () => {
  console.log("Error");
};

solicitud.onsuccess = () => {
  db = solicitud.result;
  console.log("todo perfecto");

  showPhotoInContainer()
    .then((url) => {
      containerPhoto.innerHTML = `<img src='${url}'  class="show" alt='Poner una foto'>`;
    })
    .catch((err) => {
      alert(err);
    });

  validateHomeUser()
    .then(() => {})
    .catch();

  buttonForDelete.addEventListener("click", () => {
    idVet()
      .then((id) => {
        deleteVet(id)
          .then(() => {
            window.location.replace("/src/components/accessPage/index.html");
          })
          .catch();
      })
      .catch(() => {
        alert("No se pudo eliminar el perfil");
      });
  });

  buttonForReturnDelete.addEventListener("click", () => {
    containerDeleteProfiles.classList.toggle("viewForm");
  });

  // Eventos encargados para que todo lo que tenga que ver con cambio de foto salga bien

  inputPhoto.addEventListener("change", (e) => {
    let question = confirm("Quieres establecer esta foto?");
    if (question) {
      readFile(inputPhoto.files[0]) //mandamos como parametro el primer archiv seleccionado
        .then((url) => {
          changeUrlPhoto(url) //Esta funcion le pasamos como parametro url de la imagen para que haga la actualizacion
            .then(() => {
              // alert(url);
              location.reload();
            })
            .catch((err) => alert("No se pudo cambiar la foto "));
        })
        .catch();
    }
  });

  obtainIdVet()
    .then((nit) => {
      showMedics(nit);
    })
    .catch();

  obtainIdVet()
    .then((nit) => {
      buttonCreator.addEventListener("click", (e) => {

        
        verifyOtherData()
          .then(()=>{

            verifyId()
            .then(()=>{

              createProfileMedic(nit)
            .then(() => {
              
              location.reload();
            })

            .catch(() => {
              console.log("SALIO  MAL");
            });   
            })
            .catch((e)=>{
              let mistakes=document.querySelector(".mistakes");
              mistakes.innerHTML=e;
              setTimeout(()=>{
                mistakes.innerHTML="";
              },3000);
            });
            
          })

          .catch((e)=>{
            let mistakes=document.querySelector(".mistakes");
          mistakes.innerHTML=e;
          setTimeout(()=>{
            mistakes.innerHTML="";
          },3000);
          })

      });
    })
    .catch();

  iconSearch.addEventListener("click", () => {
    let containerDoctors = document.querySelector(".slider-wrapper");
    obtainIdVet()
      .then((nit) => {
        searchProfiles(nit)
          .then()
          .catch(() => {
            containerDoctors.innerHTML = `<h1>El médico no está registrado</h1> `;
          });
      })
      .catch();
  });

  let containerDoctors = document.querySelector(".slider-wrapper");

  containerDoctors.addEventListener("click", (e) => {
    let event = e.target;
    let parent = event.parentElement;
    let parent2 = parent.previousElementSibling;

    if (event.className.includes("fa-bars")) {
      parent2.classList.toggle("viewOptionsProfile");
    } else if (event.className.includes("deleteMedic")) {
      let parent3 = event.parentElement;
      let finallyParent = parent3.parentElement;
      let listOfClass = finallyParent.className.split(" ");
    }
  });

  // ________________________________________________

  //Evento para cuando cierren sesion desactivar el perfil

  exit.addEventListener("click", (e) => {
    window.location.replace("/src/components/accessPage/index.html");
  });
};

// Start functions

const validateHomeUser = () => {
  return new Promise((resolve, reject) => {
    getUrlParams()
      .then((id) => {
        let transaction = db.transaction("veterinarys");
        let objectStore = transaction.objectStore("veterinarys");
        let cursor = objectStore.openCursor();

        cursor.onsuccess = (e) => {
          let puntero = e.target.result;
          if (puntero) {
            if (puntero.key == id) {
              let value = puntero.value;
              document.querySelector("#Name").innerHTML = puntero.value.veterinaryName;
              document.querySelector("#Address").innerHTML = puntero.value.veterinaryAdress;
              document.querySelector("#City").innerHTML = puntero.value.veterinaryCity;
              document.querySelector("#Nit").innerHTML = puntero.value.veterinaryNit;
              document.querySelector("#Phone").innerHTML = puntero.value.veterinaryPhone;
              document.querySelector("#Representative").innerHTML = puntero.value.veterinaryRepresentative;
              document.querySelector("#updateName").value = puntero.value.veterinaryName;
              document.querySelector("#updateAddress").value = puntero.value.veterinaryAdress;
              document.querySelector("#updateCity").value = puntero.value.veterinaryCity;
              document.querySelector("#updateNit").value = puntero.value.veterinaryNit;
              document.querySelector("#updatePhone").value = puntero.value.veterinaryPhone;
              document.querySelector("#updateRepresentative").value = puntero.value.veterinaryRepresentative;
              // transaction.oncomplete=()=>{
              //   resolve([value.veterinaryName , value.veterinaryAdress , value.veterinaryCity,value.veterinaryNit,value.veterinaryPhone]);
              // }
              resolve();
            }
            puntero.continue();
          } else {
            reject("No se pudo encontrar la informacion");
          }
        };
      })

      .catch();
  });
};

const showPhotoInContainer = () => {
  return new Promise((resolve, reject) => {
    getUrlParams()
      .then((id) => {
        let transaction = db.transaction("veterinarys");
        let objectStore = transaction.objectStore("veterinarys");
        let cursor = objectStore.openCursor();

        cursor.onsuccess = (e) => {
          let puntero = e.target.result;
          if (puntero) {
            if (puntero.key == id) {
              resolve(puntero.value.urlPhotoVeterinary);
            } //EXPORTAR
            puntero.continue();
          } else {
            reject("no hay ninguna url");
          }
        };
      })
      .catch();
  });
};

const changeUrlPhoto = (url) => {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction("veterinarys", "readwrite");
    let objectStore = transaction.objectStore("veterinarys");
    let cursor = objectStore.openCursor();

    cursor.onsuccess = (e) => {
      let puntero = e.target.result;
      if (puntero) {
        if (puntero.value.veterinaryStart == true) {
          //EXPORTAR
          let valueChange = puntero.value;
          valueChange.urlPhotoVeterinary = url;
          puntero.update(valueChange);
          setTimeout(() => {
            resolve();
          }, 2000);
        }
        puntero.continue();
      }
    };
    cursor.onerror = () => {
      reject("No se pudo cambiar la foto de perfil");
    };
  });
};

const idVet = () => {
  return new Promise((resolve, reject) => {
    getUrlParams()
      .then((id) => {
        let transaction = db.transaction("veterinarys");
        let objectStore = transaction.objectStore("veterinarys");
        let cursor = objectStore.openCursor();
        //EXPORTAR
        cursor.onsuccess = (e) => {
          let puntero = e.target.result;
          if (puntero) {
            if (puntero.key == id) {
              resolve(puntero.key);
            }
            puntero.continue();
          }
        };
      })
      .catch(() => {
        reject("no se enocntro nada");
      });
  });
};

const deleteVet = (id) => {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction("veterinarys", "readwrite");
    let objectStore = transaction.objectStore("veterinarys");
    objectStore.delete(id);

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject();
    };
  }); //EXPORTAR
};

const updateData = () => {
  return new Promise((resolve, reject) => {
    getUrlParams()
      .then((id) => {
        let name = document.querySelector(".updateName").value;
        let address = document.querySelector(".updateAddress").value;
        let city = document.querySelector(".updateCity").value;
        let Nit = document.querySelector(".updateNit").value;
        let phone = document.querySelector(".updatePhone").value;

        let transaction = db.transaction("veterinarys", "readwrite");
        let openStore = transaction.objectStore("veterinarys");

        let cursor = openStore.openCursor();

        cursor.addEventListener("click", (e) => {
          let puntero = e.target.result;
          if (puntero) {
            if (puntero.key == id) {
              let value2 = puntero.value;
              value2.veterinaryName = name;
              value2.veterinaryAdress = address;
              value2.veterinaryCity = city;
              value2.veterinaryPhone = phone;
              value2.veterinaryNit = Nit;

              transaction.oncomplete = () => {
                puntero.update(value2);
                resolve();
              };
            }

            puntero.continue();
          } else {
            reject("No se puedo hacer nada");
          }
        });
      })
      .catch(() => {
        throw new Error("No se pudo identificar ninguna id activa");
      });
  });
};

const createProfileMedic = (NitVeterinary) => {
  return new Promise((resolve, reject) => {
    let name = document.querySelector("#NameDoctor").value;
    let specialty = document.querySelector("#SpecDoctor").value;
    let cityDoctor = document.querySelector("#CityDoctor").value;
    let emailDoctor = document.querySelector("#emailDoctor").value;
    let idDoctor = document.querySelector("#idDoctor").value;
    let clinic = document.querySelector("#ClinicDoctor").value;


    let transaction = db.transaction(["medical-profiles"], "readwrite");
    let objectStore = transaction.objectStore("medical-profiles");

    objectStore.add({
      name: name,
      specialtyDoctor: specialty,
      city: cityDoctor,
      id: idDoctor,
      start: false,
      email: emailDoctor,
      medicalCenter:clinic,
      nitVete: NitVeterinary,
      urlPhotoDoctor: "",
    });

    let name2 = (document.querySelector("#NameDoctor").value = "");
    let specialty2 = (document.querySelector("#SpecDoctor").value = "");
    let cityDoctor2 = (document.querySelector("#CityDoctor").value = "");
    let clinic2 = (document.querySelector("#ClinicDoctor").value = "");
    let emailDoctor2 = (document.querySelector("#emailDoctor").value = "");
    let idDoctor2 = (document.querySelector("#idDoctor").value = "");

    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = () => {
      reject();
    };
  });
};

const showMedics = (nit) => {
  let transaction = db.transaction("medical-profiles");
  let objectStore = transaction.objectStore("medical-profiles");

  let cursor = objectStore.openCursor();
  let count = 0;
  let prevSlide = 1;
  let slideCount = 1;
  let newSlide = false;
  let slide = "";
  let resultHTML = document.querySelector("#slides-container");

  cursor.onsuccess = (e) => {
    let puntero = e.target.result;
    if (puntero) {
      if (puntero.value.nitVete == nit) {
        if (slideCount == 1 || slideCount == prevSlide + 3) {
          resultHTML.innerHTML += `
            <li class="slide" id="slide${slideCount}">            
              <div class="doctorCard" id="${puntero.value.id}">
                <div class="containerOptionsProfiles">
                  <p class="deleteMedic" id="delete${puntero.value.id}">Eliminar Perfil</p>
                  <input type="file" id="photo${puntero.value.id}" class="hiddenFile">
                  <p class="updateMedic" id="update${puntero.value.id}">Actualizar Foto</p>
                </div>

                <section class="doctorSection doctorSection-top">
                  <i class="fa fa-bars doctorMenu"></i>
                  <p>${puntero.value.name.toUpperCase()}</p>
                </section>
                <section class="doctorSection doctorSection-middle">
                  <img src="${puntero.value.urlPhotoDoctor}" alt="Sin foto" class="show2">
                </section>
                <section class="doctorSection doctorSection-bottom">
                  ${puntero.value.specialtyDoctor}
                </section>
              </div>
            `;
          prevSlide = slideCount;
          newSlide = true;
        } else {
          slide = document.querySelector(`#slide${prevSlide}`);
          slide.innerHTML += `         
              <div class="doctorCard" id="${puntero.value.id}">
                <div class="containerOptionsProfiles">
                  <p class="deleteMedic" id="delete${puntero.value.id}">Eliminar Perfil</p>
                  <input type="file" id="photo${puntero.value.id}" class="hiddenFile">
                  <p class="updateMedic" id="update${puntero.value.id}">Actualizar Foto</p>
                </div>
                <section class="doctorSection doctorSection-top">
                  <i class="fa fa-bars doctorMenu"></i>
                  <p>${puntero.value.name.toUpperCase()}</p>
                </section>
                <section class="doctorSection doctorSection-middle">
                  <img src="${puntero.value.urlPhotoDoctor}" alt="Sin foto" class="show2">
                </section>
                <section class="doctorSection doctorSection-bottom">
                  ${puntero.value.specialtyDoctor}
                </section>
              </div>
            `;
        }

        if (slideCount == prevSlide + 2) {
          resultHTML.innerHTML += `
            </li>            
            `;
          newSlide = false;
        }

        count++;
        slideCount++;
        let value=puntero.value;
        document.querySelector(`#delete${puntero.value.id}`).addEventListener("click", ()=> {deleteMedicFunction(value.id)});
        document.querySelector(`#update${puntero.value.id}`).addEventListener("click", ()=> {photoMedicFunction(value.id)});
      }
      puntero.continue();
    } else {      
      if (count == 0){
        let containerDoctors=document.querySelector(".slider-wrapper");
        containerDoctors.innerHTML=`<h1>No hay médicos registrados</h1>`;
      }
      sliderFunction();
    }
  };
};

const obtainIdVet = () => {
  return new Promise((resolve, reject) => {
    getUrlParams()
      .then((id) => {
        let transaction = db.transaction("veterinarys");
        let objectStore = transaction.objectStore("veterinarys");

        let cursor = objectStore.openCursor();

        cursor.onsuccess = (e) => {
          let puntero = e.target.result;

          if (puntero) {
            if (puntero.key == id) {
              resolve(puntero.value.veterinaryNit);
            }
            puntero.continue();
          } else {
            reject("Error");
          }
        };
      })

      .catch();
  });
};

const searchProfiles = (nitVete) => {
  return new Promise((resolve, reject) => {
    let inputSearch = document.querySelector("#inputSearch").value;
    if (inputSearch == ""){
      location.reload();
    }

    let transaction = db.transaction("medical-profiles");
    let objectStore = transaction.objectStore("medical-profiles");
    let cursor = objectStore.openCursor();

    cursor.onsuccess = (e) => {
      let puntero = e.target.result;
      let containerDoctors = document.querySelector("#slides-container");
      if (puntero) {
        if (puntero.value.nitVete === nitVete && puntero.value.name.toLowerCase().includes(inputSearch.toLowerCase())) {
          containerDoctors.innerHTML = `
            <li class="slide" id="slide1">            
              <div class="doctorCard" id="${puntero.value.id}">
                <div class="containerOptionsProfiles">
                  <p class="deleteMedic" id="delete${puntero.value.id}">Eliminar Perfil</p>
                  <input type="file" id="photo${puntero.value.id}" class="hiddenFile">
                  <p class="updateMedic" id="update${puntero.value.id}">Actualizar Foto</p>
                </div>
                <section class="doctorSection doctorSection-top">
                  <i class="fa fa-bars doctorMenu"></i>
                  <p>${puntero.value.name.toUpperCase()}</p>
                </section>
                <section class="doctorSection doctorSection-middle">
                  <img src="${puntero.value.urlPhotoDoctor}" alt="Sin foto" class="show2">
                </section>
                <section class="doctorSection doctorSection-bottom">
                  ${puntero.value.specialtyDoctor}
                </section>
              </div>
            </li>  
          `;
          let value=puntero.value;
          document.querySelector(`#delete${puntero.value.id}`).addEventListener("click", ()=> {deleteMedicFunction(value.id)});
          document.querySelector(`#update${puntero.value.id}`).addEventListener("click", ()=> {photoMedicFunction(value.id)});
          resolve();          
        }
        puntero.continue();
      } else {
        reject();
      }
    };
  });
};

function deleteMedicFunction(id){
    let transaction = db.transaction("medical-profiles", "readwrite");
    let objectStore = transaction.objectStore("medical-profiles");

    let cursor = objectStore.openCursor();

    cursor.onsuccess = (e) => {
    let puntero = e.target.result;
    if (puntero) {
      if (puntero.value.id == id) {
        puntero.delete();
        setTimeout(() => {
          location.reload();
        }, 300); 
      }

      puntero.continue();
    }
  };
}

function photoMedicFunction(id){
  let photoButton = document.querySelector(`#photo${id}`);
  let fileUploader = document.querySelector(`#photo${id}`);
  photoButton.click();
  photoButton.addEventListener("change", (e) => {
    let question = confirm("Quieres establecer esta foto?");
    if (question) {
      readFile(fileUploader.files[0]) //mandamos como parametro el primer archiv seleccionado
        .then((url) => {
          changeDoctorUrlPhoto(id, url) //Esta funcion le pasamos como parametro url de la imagen para que haga la actualizacion
            .then(() => {
              // alert(url);
              location.reload();
            })
            .catch((err) => alert("No se pudo cambiar la foto "));
        })
        .catch();
    }
  });
  let transaction = db.transaction("medical-profiles", "readwrite");
  let objectStore = transaction.objectStore("medical-profiles");
  let cursor = objectStore.openCursor();  
}

const changeDoctorUrlPhoto = (id, url) => {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction("medical-profiles", "readwrite");
    let objectStore = transaction.objectStore("medical-profiles");
    let cursor = objectStore.openCursor();

    cursor.onsuccess = (e) => {
      let puntero = e.target.result;
      if (puntero) {
        if (puntero.value.id == id) {
          //EXPORTAR
          let valueChange = puntero.value;
          valueChange.urlPhotoDoctor = url;
          puntero.update(valueChange);
          setTimeout(() => {
            resolve();
          }, 2000);
        }
        puntero.continue();
      }
    };
    cursor.onerror = () => {
      reject("No se pudo cambiar la foto de perfil");
    };
  });
};



containerPhoto.addEventListener("click", () => {
  inputPhoto.click();
});

otherOptionChange1.addEventListener("click", () => {
  inputPhoto.click();
});

otherOptionChange2.addEventListener("click", () => {
  inputPhoto.click();
});

delete1.addEventListener("click", () => {
  document
    .querySelector(".containerDeleteProfiles")
    .classList.toggle("viewForm");
});

delete2.addEventListener("click", () => {
  document
    .querySelector(".containerDeleteProfiles")
    .classList.toggle("viewForm");
});

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

  updateVeterinary()
    .then((a) => {})
    .catch((err) => alert("No se pudo actualizar el veterinario"));
});

function sliderFunction() {
  const slidesContainer = document.getElementById("slides-container");
  const slide = document.querySelector(".slide");
  const prevButton = document.getElementById("slide-arrow-prev");
  const nextButton = document.getElementById("slide-arrow-next");

  nextButton.addEventListener("click", () => {
    const slideWidth = slide.clientWidth;
    slidesContainer.scrollLeft += slideWidth;
  });

  prevButton.addEventListener("click", () => {
    const slideWidth = slide.clientWidth;
    slidesContainer.scrollLeft -= slideWidth;
  });
}



const updateVeterinary = () => {
  return new Promise((resolve, reject) => {
    getUrlParams()
    .then((id)=>{
      let name = document.querySelector("#updateName").value;
    let address = document.querySelector("#updateAddress").value;
    let city = document.querySelector("#updateCity").value;
    let nit = document.querySelector("#updateNit").value;
    let phone = document.querySelector("#updatePhone").value;
    let representative = document.querySelector("#updateRepresentative").value;

    let transaction = db.transaction(["veterinarys"], "readwrite");
    let store = transaction.objectStore("veterinarys");

    let cursor = store.openCursor();
    cursor.onsuccess = (e) => {
      let puntero = e.target.result;
      if (puntero) {
        if (puntero.key==id) {
          let veterynary = puntero.value;
          veterynary.veterinaryName = name;
          veterynary.veterinaryAdress = address;
          veterynary.veterinaryCity = city;
          veterynary.veterinaryNit = nit;
          veterynary.veterinaryPhone = phone;
          veterynary.veterinaryRepresentative = representative;
          puntero.update(veterynary);
          document.querySelector("#Name").innerHTML = name;
          document.querySelector("#Address").innerHTML = address;
          document.querySelector("#City").innerHTML = city;
          document.querySelector("#Nit").innerHTML = nit;
          document.querySelector("#Phone").innerHTML = phone;
          document.querySelector("#Representative").innerHTML = representative;
          document.querySelector("#updateName").value = name;
          document.querySelector("#updateAddress").value = address;
          document.querySelector("#updateCity").value = city;
          document.querySelector("#updateNit").value = nit;
          document.querySelector("#updatePhone").value = phone;
          document.querySelector("#updateRepresentative").value = representative;
          setTimeout(() => {
            resolve();
            showVeterinaryData(e);
          }, 2000);
        }
        puntero.continue();
      }
    };
    cursor.onerror = () => {
      reject("no se pudo actualizar perfil");
    };

    })
    .catch();
    
  });
};

function showVeterinaryData(e) {
  let cursor = e.target.result;

  if (cursor) {
    if (cursor.value.id == vetId) {
      document.querySelector("#Name").innerHTML = cursor.value.name;
      document.querySelector("#Address").innerHTML = cursor.value.address;
      document.querySelector("#City").innerHTML = cursor.value.city;
      document.querySelector("#Nit").innerHTML = cursor.value.nit;
      document.querySelector("#Phone").innerHTML = cursor.value.phone;
      document.querySelector("#Services").innerHTML = cursor.value.services;
      document.querySelector("#Representative").innerHTML = cursor.value.representative;
      document.querySelector("#updateName").value = cursor.value.name;
      document.querySelector("#updateAddress").value = cursor.value.address;
      document.querySelector("#updateCity").value = cursor.value.city;
      document.querySelector("#updateNit").value = cursor.value.nit;
      document.querySelector("#updatePhone").value = cursor.value.phone;
      document.querySelector("#updateServices").value = cursor.value.services;
      document.querySelector("#updateRepresentative").value = cursor.value.representative;
    }
    cursor.continue();
  }
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const verifyId=()=>{
  return new Promise((resolve,reject)=>{
    let id=document.querySelector("#idDoctor").value;
    for(let x of id){
      let convert=parseInt(x);
      if(isNaN(convert)){
        reject("En cedula no ingreses ninguna letra");
      }
    }

    if(id.length==10){
      let transaction = db.transaction("medical-profiles");
      let openStore=transaction.objectStore("medical-profiles");
      let cursor=openStore.openCursor();
  
      cursor.onsuccess=(e)=>{
        let puntero=e.target.result;
        if(puntero){
          if(puntero.value.id==id){
            reject("El documento ya esta en uso");
          }
          puntero.continue()
        }
        else{
          resolve();
        }
      }
    }
    else{
      reject("Pon la cantidad de numeros correcta");
    }
  });
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------


const verifyOtherData=()=>{
  return new Promise((resolve,reject)=>{
    let estructure=["@gmail.com","@yahoo.com","@hotmail.com"]
    let name=document.querySelector("#NameDoctor").value;
    let charge=document.querySelector("#PositionDoctor").value;
    let city=document.querySelector("#CityDoctor").value;
    let clinic=document.querySelector("#ClinicDoctor").value;
    let email=document.querySelector("#emailDoctor").value;
    
    try{
      if(name.length<2){
          reject("Pon un nombre con mas caracteres");
      }
      else{
          if(charge.length<2){
              reject("Completa el cargo");
          }
          else{   
            if(city.length<3){
              reject("Completa la ciudad");
            }                      
            else{
              if(clinic.length<3){
                reject("Completa la clinica");
              }

              else{
                if(email.length<=12){
                  reject("completa el correo");
                }
                else{
                  if(email.includes("@")){
                    let index=email.indexOf("@");
                    let estructureEmails=email.substring(index,200);

                    if(!estructure.includes(estructureEmails)){
                      reject("El correo ingresado no tiene la estructura correcta");
                    }
                    else{
                        resolve();
                    }
                  } 

                  else{
                    reject("El correo ingresado no tiene la estructura correcta");
                  }
                }
              }
            } 
          }
      }
  }
  catch(error){
      containerMistakes.innerHTML=error.message;
      setTimeout(()=>{
          containerMistakes.innerHTML="";
      },3000);
  }


  });
}