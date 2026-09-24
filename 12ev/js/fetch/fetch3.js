await fetch('https://surveys-5jvt.onrender.com/api/cars/')
    .then((response) => response.json())
    .then((json) => console.log(json));

await fetch('https://surveys-5jvt.onrender.com/api/cars/', {
  method: 'POST',
  body: JSON.stringify(
{
   "model": "Model name",
  "brand": "Brand name",
  "year": 2024
}
  ),
  headers: {
    "Content-type": "application/json; charset=UTF-8",
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));

await fetch('https://surveys-5jvt.onrender.com/api/cars/6', {
  method: 'PUT',
  body: JSON.stringify({
 model: "New model name",
  brand: "New brand name",
  year: 2025
  }),
  headers: {
    "Content-type": "application/json; charset=UTF-8",
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));

await fetch('https://surveys-5jvt.onrender.com/api/cars/4',{
    method: 'GET'
})
    .then((response) => response.json())
    .then((json) => console.log(json));

await fetch('https://surveys-5jvt.onrender.com/api/cars/', {
  method: 'PATCH',
  body: JSON.stringify({
    title: "Bogyo es baboca",
  }),
  headers: {
    "Content-type": "application/json; charset=UTF-8",
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));

