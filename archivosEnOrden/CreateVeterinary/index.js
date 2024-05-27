let db;

function initDB(){
    let saveBtn = document.querySelector("#saveButton");
    saveBtn.addEventListener("click", saveVeterinary);
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
}

function CreateStores(e){
    let dataBase = e.target.result;
  
    let vetStore = dataBase.createObjectStore("Veterinary", {keyPath: "id", autoIncrement: true});
    vetStore.createIndex("Veterinary", "id", {unique: true});
  
    let DoctorStore = dataBase.createObjectStore("Doctor", {keyPath: "id", autoIncrement: true});
    DoctorStore.createIndex("Doctor", "id", {unique: true});
  }

function saveVeterinary(){
    let name = document.querySelector("#Name").value;
    let address = document.querySelector("#Address").value;
    let city = document.querySelector("#City").value;
    let nit = document.querySelector("#Nit").value;
    let phone = document.querySelector("#Phone").value;
    let services = document.querySelector("#Services").value;
    let representative = document.querySelector("#Representative").value;

    let transaction = db.transaction(["Veterinary"], "readwrite");
    let store = transaction.objectStore("Veterinary");

    store.add({
        name: name,
        address: address,
        city: city,
        nit: nit,
        phone: phone,
        services: services,
        representative: representative
    });

    document.querySelector("#Name").value = "";
    document.querySelector("#Address").value = "";
    document.querySelector("#City").value = "";
    document.querySelector("#Nit").value = "";
    document.querySelector("#Phone").value = "";
    document.querySelector("#Services").value = "";
    document.querySelector("#Representative").value = "";
}

window.addEventListener("load", initDB);
