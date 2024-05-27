let db;
let url = new URL(document.URL);
let search_params = url.searchParams; 
let vetId = search_params.get("id");
function initDB(){
    let request = indexedDB.open("datos")

    request.addEventListener("error", ShowError);
    request.addEventListener("success", Start);
    request.addEventListener("upgradeneeded", CreateStores);
}

function ShowError(e){
  alert(`DB error: 
          code: ${e.code}
          message: ${e.message}`);
}

function Start(e){
  db = e.target.result;
  openDBCursor();
}

function CreateStores(e){
  let dataBase = e.target.result;

  let vetStore = dataBase.createObjectStore("Veterinary", {keyPath: "id", autoIncrement: true});
  vetStore.createIndex("Veterinary", "id", {unique: true});

  let DoctorStore = dataBase.createObjectStore("Doctor", {keyPath: "id", autoIncrement: true});
  DoctorStore.createIndex("Doctor", "id", {unique: true});
}

function openDBCursor(){
  let transaction = db.transaction(["Veterinary"], "readwrite");
  let store = transaction.objectStore("Veterinary");
  let cursor = store.openCursor();
  cursor.addEventListener("success", showVeterinaryData);
}

function updateVeterinary(){
  let id = vetId;
  let name = document.querySelector("#updateName").value;
  let address = document.querySelector("#updateAddress").value;
  let city = document.querySelector("#updateCity").value;
  let nit = document.querySelector("#updateNit").value;
  let phone = document.querySelector("#updatePhone").value;
  let services = document.querySelector("#updateServices").value;
  let representative = document.querySelector("#updateRepresentative").value;

  let transaction = db.transaction(["Veterinary"], "readwrite");
  let store = transaction.objectStore("Veterinary");

  store.put({
      id: parseInt(id),
      name: name,
      address: address,
      city: city,
      nit: nit,
      phone: phone,
      services: services,
      representative: representative
  });

  let cursor = store.openCursor();
  cursor.addEventListener("success", showVeterinaryData);
}

function loadDoctorSlider(){
  let cursor = e.target.result;

  if (cursor){
    
    cursor.continue();
  }

} 

function showVeterinaryData(e){
  let cursor = e.target.result;

  if (cursor){
    if (cursor.value.id == vetId){
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

function saveDoctor(){
  let name = document.querySelector("#NameDoctor").value;
  let position = document.querySelector("#PositionDoctor").value;
  let spec = document.querySelector("#SpecDoctor").value;
  let city = document.querySelector("#CityDoctor").value;
  let clinic = document.querySelector("#ClinicDoctor").value;

  let transaction = db.transaction(["Doctor"], "readwrite");
  let store = transaction.objectStore("Doctor");

  store.put({
      name: name,
      position: position,
      spec: spec,
      city: city,
      clinic: clinic,
      veterinary: vetId
  });

  document.querySelector("#NameDoctor").value = "";
  document.querySelector("#PositionDoctor").value = "";
  document.querySelector("#SpecOption").selected = true;
  document.querySelector("#CityDoctor").value = "";
  document.querySelector("#ClinicDoctor").value = "";

  cursor.addEventListener("success", loadDoctorSlider);
}

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

let exitCircle = document.querySelector(".exitCircle");
exitCircle.addEventListener("click", (e) => {
  window.location.replace("../accessPage/index.html");
});

let createDoctor = document.querySelector("#createDoctor");
createDoctor.addEventListener("click", (e) => {
  createDoctorForm = document.querySelector("#createDoctorForm");
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

let BtnCreateDoctor = document.querySelector("#BtnCreateDoctor");
BtnCreateDoctor.addEventListener("click", (e) => {
  saveDoctor();
});

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

window.addEventListener("load", initDB);