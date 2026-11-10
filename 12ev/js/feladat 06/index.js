function getCar(){
    fetch("https://surveys-5jvt.onrender.com/api/cars/")
    .then(response=>{
        if(!response.ok){
            throw new Error("Network was not ok")
        }
        return response.json();
    }).then(car=>{
         console.log(car);
    }).catch(error=>{
        console.error("There was a problem",error);
    })
}

function postCar(){
    fetch("https://surveys-5jvt.onrender.com/api/cars/",{
        method:"POST",

        body:JSON.stringify({
        title: "foo",
        body: "bar",
        userId: 1
        }),
        headers:{
            "Content-type":"application/json; charset=UTF-8"
        }
    })
    .then(response=>response.json())
    .then(json=>console.log(json));
}

function putCar(){
    fetch("https://surveys-5jvt.onrender.com/api/cars/11",{
        method:"PUT",

        body:JSON.stringify({
        model: 'Charger',
        brand: 'Dodge',
        year: 2017
        }),
        headers:{
            "Content-type":"application/json; charset=UTF-8"
        }
    })
    .then(response=>response.json())
    .then(json=>console.log(json));
}

function patchCar(){
    fetch("https://surveys-5jvt.onrender.com/api/cars/6",{
        method:"PATCH",

        body:JSON.stringify({
        model: 'Crow Victoria',
        brand: 'Ford',
        }),
        headers:{
            "Content-type":"application/json; charset=UTF-8"
        }
    })
    .then(response=>response.json())
    .then(json=>console.log(json));
}

function deleteCar(){
    fetch("https://surveys-5jvt.onrender.com/api/cars/11",{
        method:"DELETE",

        headers:{
            "Content-type":"application/json; charset=UTF-8"
        }
    })
    .then(response=>{
        if(response.ok){
            return response.json();
        }
        throw new Error("Network response was not OK");
    })
    .then(json=>console.log(json))
    .catch(error=>console.error("There was a problem with the fetch operation!",error));
}


putCar();
//patchCar();
//deleteCar();
getCar();