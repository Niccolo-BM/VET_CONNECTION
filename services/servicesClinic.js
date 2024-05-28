export const getUrlParams=()=>{
    return new Promise((resolve,reject)=>{
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const id = urlParams.get('id');

      if (id) {
          // Haces lo que necesites con el ID obtenido
          resolve(id);
      } else {
          reject('No se encontró el parámetro ID en la URL.');
      }
    });
}