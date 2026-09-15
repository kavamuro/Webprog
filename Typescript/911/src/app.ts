import { isFiatal } from "./helper/isFiatal";
import { Ember } from "./types/Ember";

console.log("Hello World");

const x: number = 5;

const valaki: Ember = { nev: "Valaki", kor: 5 };

const emberek: Array<Ember> = [
  { nev: "Kati", kor: 16 },
  { nev: "Pisti", kor: 29 },
  { nev: "Laci", kor: 12 },
];

const fiatalok: Array<Ember> = emberek.filter((i: Ember) => isFiatal(i.kor));

fiatalok.forEach((i) => console.log(i.nev));
