const fs = require('fs');
const readline = require('readline');
const EventEmitter = require('events');

class ResumoEmitter extends EventEmitter {}
const resumoEmitter = new ResumoEmitter();

function lerArquivo(caminho) {
  let soma = 0;
  let linhasTexto = 0;
  let linhasNumero = 0;
  let tempoInicio = Date.now();

  
    const rl = readline.createInterface({
    input: fs.createReadStream(caminho),
    crlfDelay: Infinity,
  });

  
  rl.on('line', (linha) => {
     linha = linha.trim();
if (/^\d+$/.test(linha)) {
soma += parseInt(linha);
linhasNumero++;
    } else {
      
      linhasTexto++;
    }
  });

  
  rl.on('close', () => {
    let tempoFim = Date.now();
    let tempoExecucao = tempoFim - tempoInicio;

    
    resumoEmitter.emit('resumo', {
      soma,
      linhasTexto,
      linhasNumero,
      tempoExecucao,
    });
  });
}


function exibirResumo(dados) {
  
  let { soma, linhasTexto, linhasNumero, tempoExecucao } = dados;

  
  console.log(`\nResumo do arquivo:\n`);
  console.log(`- Soma dos números dentro deste arquivo: ${soma}`);
  console.log(`- Quantas linhas continham texto: ${linhasTexto}`);
  console.log(`- Quanto tempo demorou a execução: ${tempoExecucao} ms\n`);
}


function perguntarNovamente() {
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

 
  rl.question('Deseja executar novamente? (s/n) ', (resposta) => {
    
    rl.close();

    
    if (resposta.toLowerCase() === 's') {
      
      principal();
    } else {
      
      console.log('Encerrando! ');
      return;
    }
  });
}


function principal() {
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  
  rl.question('Digite o caminho de um arquivo txt do seu computador: ', (caminho) => {
    
    rl.close();

    
    lerArquivo(caminho);
  });
}


resumoEmitter.on('resumo', (dados) => {
  
  exibirResumo(dados);

  
  perguntarNovamente();
});


principal();
