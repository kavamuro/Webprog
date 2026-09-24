const person = {
    name: "alice",
    age: 19,
    city: "Szeged",
    driverLicence: true
}
person.greet = function() {
    console.log(`Hello ${this.name}`)
}
console.log(person)
console.table(person)

const person2 = {
    name: "Bob",
    age: 20,
    city: "London",
    driverLicence: true,
    greet() {
        console.log(`Hello ${this.name}`)
    }
}

// person2.greet()

for (let key in person){
    console.log(` Key: ${key} -> Value: ${person[key]}`)
}
