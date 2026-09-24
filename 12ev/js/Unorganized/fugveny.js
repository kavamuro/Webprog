const link = "https://surveys-5jvt.onrender.com/api/cars/"

async function getPut()
{
    var id = prompt("Add meg a cserelendo id?")
    try
    {
        await fetch(`${link}${id}`, {
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

    }
    catch (error)
    { console.error(error)}
}
async function getPost() {
    var name = prompt("Add meg az uj modelt")
    var type = prompt("Add meg az uj brandet")
    var num = prompt("Add meg az uj evet")

    await fetch('https://surveys-5jvt.onrender.com/api/cars/', {
    method: 'POST',
    body: JSON.stringify(
    {
    model: `${name}`,
    brand: `${type}`,
    year: parseInt(num)
    }
    ),
    headers: {
        "Content-type": "application/json; charset=UTF-8",
    },
    })
    .then((response) => response.json())
    .then((json) => console.log(json));
    }

async function del() {
    var id = prompt("Add meg a id a torleshez")
    await fetch(`${link}${id}`, {
    method: 'DELETE',
    });
}