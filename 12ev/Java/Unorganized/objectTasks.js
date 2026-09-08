let students = [];
let numberOfStudents = parseInt(prompt("Hany tanulot akarsz felvinni?"), 10);

for (let i = 0; i < numberOfStudents; i++) {
    let name = prompt("Adja meg a tanulo nevet:");
    let email = prompt("Adja meg a tanulo e-mailt:");

    let student = {
        name: name,
        email: email
    };
    students.push(student);
}

console.log("Tanulo adatok:");
students.forEach(student => {
    console.log(`Nev: ${student.name} Email: ${student.email}`);
});
