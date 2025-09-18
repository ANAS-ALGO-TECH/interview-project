const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Real-Time Collaboration Dashboard Demo...\n');

// Start backend
console.log('📦 Starting Backend Server...');
const backend = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// Wait a bit then start frontend
setTimeout(() => {
  console.log('📦 Starting Frontend Server...');
  const frontend = spawn('npm', ['start'], {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
    shell: true
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    backend.kill();
    frontend.kill();
    process.exit(0);
  });

}, 3000);

// Handle backend errors
backend.on('error', (error) => {
  console.error('❌ Backend error:', error);
});

backend.on('close', (code) => {
  if (code !== 0) {
    console.log(`Backend process exited with code ${code}`);
  }
});
