export const getUrlParams2=()=>{
    return new Promise((resolve,reject)=>{
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const id = urlParams.get('Pet');

      if (id) {
          // Haces lo que necesites con el ID obtenido
          resolve(id);
      } else {
          reject('No se encontró el parámetro pet en la URL.');
      }
    });
}

export const getIdDoctorUrl=()=>{
    return new Promise((resolve,reject)=>{
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const id = urlParams.get('medic');

      if (id) {
          // Haces lo que necesites con el ID obtenido
          resolve(id);
      } else {
          reject('No se encontró el parámetro medic en la URL.');
      }
    });
}


