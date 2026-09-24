import fs from 'fs'
import os from 'os'
import input from ''

let content = fs.readFileSync('nyomas.txt', {encoding: 'utf-8'})
const arr = content.split(',').map(e => parseInt(e))
let minimum = arr[0]
let index = 0
for(let i = 0; i <arr.length; i++)
{
    if(arr[i] < minimum)
    {
        minimum = arr[i];
        index = i;
    }
}
const ertek = await input("Minel kisebb ertekeket keres?");
let szama = 0;
for(const szam of arr)
{
    if(szam < ertek)
    {
        szama++;
    }
}
let csokkenes = 0;
for(let i = 0; i < arr.length - 1; i++)
{
    if(arr[i] - arr[arr + 1] > csokkenes)
    {
        csokkenes = arr[i] - arr[i + 1]
    }
}