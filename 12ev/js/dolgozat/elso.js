function deleteCar(id) {
   fetch(`https://surveys-5jvt.onrender.com/api/cars/${id}`, {method: "DELETE"})
   .then(response => response.json())
   .then(json => console.log(json));
}
deleteCar(53);