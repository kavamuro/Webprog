async function getPhoneById(id) {
    const response = await fetch(`https://surveys-5jvt.onrender.com/api/phones/${id}`, {method: "GET"});
    const data = await response.json;
    return data;
}
const phone = await getPhoneById(3);
console.log(phone);