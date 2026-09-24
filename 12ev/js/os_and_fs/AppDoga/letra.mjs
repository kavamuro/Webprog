import os from 'os'
import fs from 'fs'

let beolvas = fs.readFileSync('AppDoga/dobasok.txt', {encoding:'utf8'});
let dobasok =  beolvas.trim().split(",").map(Number)
console.log(dobasok);
let mezo = 0;
let letra= 0;

let sor = "";

for(let dobas of dobasok)
{
 mezo+=dobas;
 if(mezo % 10 === 0)
 {
    letra++;
    mezo -= 3;
    sor += `${mezo - dobas + dobas} ` 
 }
 sor += `${mezo} ` 
 if(mezo >= 25){break;}
}
console.log("2.feladat")
console.log(sor.trim())
console.log("3.feladat")
console.log(`A jatek soran ${letra} db letra tortent`)
console.log("4.feladat")
if(mezo >= 45){ console.log('A jatekot befejezte')}
if(mezo < 45) {console.log('A jatekot abba hagyta')}