const { spawn } = require('cross-spawn');

// Iniciar o backend
console.log('Iniciando o backend...');
spawn('php', ['artisan', 'serve'], {
  cwd: 'backend',
  stdio: 'inherit',
  shell: true,
});

// Iniciar o frontend
console.log('Iniciando o frontend...');
spawn('npm', ['run', 'dev'], {
  cwd: 'frontend',
  stdio: 'inherit',
  shell: true,
});
