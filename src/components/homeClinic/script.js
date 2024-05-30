// Import functions from the file (concept called inheritance)
import { readFile, getUrlParams } from "../../../services/servicesMedic.js"; 

/* Elements that are going to be used since the page loads */
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

// Start db
var db;
var solicitud = indexedDB.open("datos");

solicitud.onerror = () => {
  console.log("Error");
};

solicitud.onsuccess = () => {
  db = solicitud.result;
  //show veterinary photo when the page loads
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

  //deletes the veterinary from database and send the user to the access page 
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

  //add event click to upload the veterinary photo
  inputPhoto.addEventListener("change", (e) => {
    let question = confirm("Quieres establecer esta foto?");
    if (question) {
      //reads the photo that is being uploaded
      readFile(inputPhoto.files[0])
        .then((url) => {
          //if the photo is ok, then it changes the url of the veterinary photo in database
          changeUrlPhoto(url) 
            .then(() => {
              location.reload();
            })
            .catch((err) => alert("No se pudo cambiar la foto "));
        })
        .catch();
    }
  });

  //gets the veterinary id to show the asociated doctors
  obtainIdVet()
    .then((nit) => {
      showMedics(nit)
      .then(() =>{
        //once the doctor cards are created, this function gives the functionality to the delete an update button
        cardFunctions();
      });
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

  //adds the click event for the search doctor bar on the icon to search a medic by name
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

  //adds a click event to the exit button to close the veterinary session
  exit.addEventListener("click", (e) => {
    changeStartedSessionValue()
    .then(()=>{
      console.log('profile deactivated');
    })
    .catch((e)=>{
      console.log(e);
    });
  });
};

// loads the veterinary data in the right side of the section 1
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

//if the veterinary photo exists, when the page is loaded, this function displays the veterinary photo
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

//modifies the photo url for the current veterinary
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

//gets the veterinary id for multiple purposes (some functions uses the veterinary id to update in database)
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

//deletes the veterinary on database
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
  });
};

//updates veterinary data on database
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

//creates a doctor profile on database and refresh the doctor slider
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

//show all the doctors asociated to the veterinary in the slider when the page loads
const showMedics = (nit) => {
  return new Promise((resolve, reject) => {
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
                  <img src="${puntero.value.urlPhotoDoctor}" alt="Sin foto" class="show2"  onerror=" this.src='../../assets/img/sinFotoPerfil.png'">
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
                  <img src="${puntero.value.urlPhotoDoctor}" alt="Sin foto" class="show2" onerror=" this.src='../../assets/img/sinFotoPerfil.png'">
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
      }
      puntero.continue();
    } else {      
      if (count == 0){
        let containerDoctors=document.querySelector(".slider-wrapper");
        containerDoctors.innerHTML=`<h1>No hay médicos registrados</h1>`;
      }
      sliderFunction();
      resolve();
    }
  };
});
};

//gets the veterinary id from database
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

//search a doctor by name (part of the name should be included in the search bar at least)
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
                  <img src="${puntero.value.urlPhotoDoctor}" alt="Sin foto" class="show2"  onerror=" this.src='../../assets/img/sinFotoPerfil.png'">
                </section>
                <section class="doctorSection doctorSection-bottom">
                  ${puntero.value.specialtyDoctor}
                </section>
              </div>
            </li>  
          `;
          let value=puntero.value;
          console.log("funcionalidad a tarjeta: " + value.id);
          document.querySelector(`#delete${value.id}`).addEventListener("click", ()=> {deleteMedicFunction(value.id)});
          document.querySelector(`#update${value.id}`).addEventListener("click", ()=> {photoMedicFunction(value.id)});
          resolve();          
        }
        puntero.continue();
      } else {
        reject();
      }
    };
  });
};

//deletes doctor by id in database
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

//updates doctor photo in database
function photoMedicFunction(id){
  console.log("funcion foto de: " + id);
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

//updates the photo if exists in database
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

// click events required to trigger previous functions
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

//Header and footer
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

//Event to the search pet bar
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

//Close Search Pet div
let closeSearchPet = document.querySelector("#closeSearchPet");
closeSearchPet.addEventListener("click", (e) => {
  let searchPet = document.querySelector("#searchPet");
  searchPet.style.display = "none";
});

// close doctor creation form
let closeCreateDoctor = document.querySelector("#closeCreateDoctor");
closeCreateDoctor.addEventListener("click", (e) => {
  let createDoctor = document.querySelector("#createDoctorForm");
  createDoctor.style.display = "none";
});

// open doctor creation form
let createDoctor = document.querySelector("#createDoctor");
createDoctor.addEventListener("click", (e) => {
  let createDoctorForm = document.querySelector("#createDoctorForm");
  createDoctorForm.style.display = "block";
});

// hide veterinary paragraphs on the right side of the section one and show the input fields to update the veterinary data
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

//save veterinary data on the right side of the section 1
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

// all the slider arrow functionality
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

//update the veterinary data on database
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

//show veterinary data on the right side of the section one
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
// create doctor id field validations
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

//veterinary data other fields validations
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

//change the veterinary session in true after the access page send the user to the homeclinic page
const changeStartedSessionValue=()=>{
  return new Promise((resolve,reject)=>{
  getUrlParams()
  .then((id)=>{
    let transaction=db.transaction("veterinarys","readwrite");
  let objetStore=transaction.objectStore("veterinarys");

  transaction.oncomplete=()=>{
    window.location.replace("/src/components/accessPage/index.html");
    resolve();
  }

  let cursorStopped=false;
  let cursor=objetStore.openCursor();

  cursor.addEventListener("success",(e)=>{
      let puntero=e.target.result;
      console.log(puntero);
      if(puntero && !cursorStopped){
          let valor=puntero.value;
          if(puntero.key==id){
            if(puntero.value.veterinaryStart==true){
              valor.veterinaryStart= false; // Modificar la propiedad inicio a true
              puntero.update(valor);
              cursorStopped=true;
            

            }           
          }
          puntero.continue();
      }
        else{
          reject("El correo no existe");
        }    
  });
  })
  .catch();
  });
}

//doctor card functionalities to be added once the cards are loaded in screen
function cardFunctions(){
  let updateCards = document.querySelectorAll('.updateMedic');
  updateCards.forEach(function (card) {
  let updateCard = document.querySelector(`#${card.id}`);
  if(updateCard){
    document.querySelector(`#${card.id}`).addEventListener("click", ()=> {photoMedicFunction(card.id.replace("update", ""))});
    
  }
});

let deleteCards = document.querySelectorAll('.deleteMedic');
deleteCards.forEach(function (card) {
  let deleteCard = document.querySelector(`#${card.id}`);

  if(deleteCard){
    document.querySelector(`#${card.id}`).addEventListener("click", ()=> {deleteMedicFunction(card.id.replace("delete", ""))});
  }
});
}