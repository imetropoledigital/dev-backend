const randomWords = require('random-words');
const fs = require('fs');

console.log(randomWords());

//leitura síncrona
const data = fs.readFileSync('./tmp.txt', {encoding: 'utf-8', flag: 'r'})
console.log(data)
console.log('Aguardou terminar de ler para executar aqui!')

//leitura assíncrona
fs.readFile('./tmp.txt', {encoding: 'utf-8', flag: 'r'}, function (err, data){
    if (!err){
        console.log(data)
    }
})
console.log('Executou aqui! Provavelmente essa linha imprimiu antes da leitura do arquivo terminar!')