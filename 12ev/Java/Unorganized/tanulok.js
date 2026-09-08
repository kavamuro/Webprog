import input from "./input.js";

const tanulokSzama = await input("Hany tanulot rogzit?");
const tanulok = [];

for (let i = 0; i < tanulokSzama; i++) {
  const name = await input("Adja meg a tanulo nevet:");
  const email = await input("Adja meg a tanulo e-mailt:");

  students.push({ name: name, email: email });
}

tanulok.forEach((item) => {
  console.log(`Name: ${item.name}, email: ${item.email}`);
});
