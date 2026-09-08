import os from 'os'
import fs from 'fs'

let content = fs.readFileSync('focistak.txt', {encoding: 'utf-8'})
// console.log(content)

// content += '\nRonaldo 1024 Al-Nasr'
// fs.writeFileSync('focistak.txt', content)
// fs.writeFileSync('focistak.txt', '\nPuskas 128 MTK',{flag: 'a+'})

fs.mkdir('pelda')
if(fs.existsSync('focista.txt'))
{
    fs.writeFileSync('abc.txt',content,{encoding:'utf-8'})
} else{ console.log('A fajl nem letezik')}

fs.unlinkSync('abc.txt')

fs.rmdirSync('pelda')