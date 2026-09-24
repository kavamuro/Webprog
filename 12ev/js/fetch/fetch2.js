fetch('https://surveys-5jvt.onrender.com/api/books/')
    .then((response) => response.json())
    .then((json) => console.log(json));

fetch('https://surveys-5jvt.onrender.com/api/books', {
  method: 'POST',
  body: JSON.stringify(
{
  title: "Nem tudom",
  author: "Maksa Patrik",
  year: 1456
}
  ),
  headers: {
    "Content-type": "application/json; charset=UTF-8",
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));

fetch('https://surveys-5jvt.onrender.com/api/books/15', {
  method: 'PUT',
  body: JSON.stringify({
  title: "Mici macko",
  author: "Alan Alexander Milne",
  year: 1926
  }),
  headers: {
    "Content-type": "application/json; charset=UTF-8",
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));

fetch('https://surveys-5jvt.onrender.com/api/books/9',{
    method: 'GET'
})
    .then((response) => response.json())
    .then((json) => console.log(json));

fetch('https://surveys-5jvt.onrender.com/api/books/14', {
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

fetch('https://surveys-5jvt.onrender.com/api/books/15', {
  method: 'DELETE',
});