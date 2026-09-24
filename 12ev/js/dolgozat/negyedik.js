function saveUser(firstName, lastName, email, password) {
  fetch("https://surveys-5jvt.onrender.com/api/users/", {method: "POST",
    headers:{
        "Content-type": "application/json"
    },
    body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    })
  })
   .then(response => response.json())
   .then(json => console.log(json))
}

saveUser("TungTungTung", "Sahur", "tripleT@brain.rot", "ttt")