function getBooks() {
    fetch("https://surveys-5jvt.onrender.com/api/books/", {method: "GET"})
   .then(response => response.json())
   .then(json => console.log(json))
}

getBooks();