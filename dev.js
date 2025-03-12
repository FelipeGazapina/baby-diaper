const { spawn } = require('child_process');
const path = require('path');

// Função para executar comandos em um diretório específico
function runCommand(command, args, cwd) {
  const proc = spawn(command, args, {
    cwd,
    shell: true,
    stdio: 'inherit'
  });

  proc.on('error', (error) => {
    console.error(`Erro ao executar ${command}: ${error.message}`);
  });

  return proc;
}

// Iniciar o backend (Docker)
console.log('Iniciando o backend (Docker)...');
const dockerProc = runCommand('docker-compose', ['up'], process.cwd());

// Aguardar um tempo para o backend iniciar
setTimeout(() => {
  // Iniciar o frontend
  console.log('Iniciando o frontend...');
  const frontendPath = path.join(process.cwd(), 'frontend');
  const frontendProc = runCommand('npm', ['start'], frontendPath);

  // Lidar com o encerramento do processo
  process.on('SIGINT', () => {
    console.log('Encerrando os processos...');
    frontendProc.kill();
    dockerProc.kill();
    process.exit(0);
  });
}, 10000); // Aguardar 10 segundos para o backend iniciar 