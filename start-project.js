const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Real-Time Collaboration Dashboard...\n');

// Function to run a command
function runCommand(command, args, cwd, name) {
  return new Promise((resolve, reject) => {
    console.log(`📦 Starting ${name}...`);
    const process = spawn(command, args, { 
      cwd, 
      stdio: 'inherit',
      shell: true 
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${name} exited with code ${code}`));
      }
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
}

async function startProject() {
  try {
    // Check if dependencies are installed
    const fs = require('fs');
    
    if (!fs.existsSync('node_modules')) {
      console.log('📦 Installing root dependencies...');
      await runCommand('npm', ['install'], process.cwd(), 'Root Dependencies');
    }

    if (!fs.existsSync('backend/node_modules')) {
      console.log('📦 Installing backend dependencies...');
      await runCommand('npm', ['install'], path.join(process.cwd(), 'backend'), 'Backend Dependencies');
    }

    if (!fs.existsSync('frontend/node_modules')) {
      console.log('📦 Installing frontend dependencies...');
      await runCommand('npm', ['install'], path.join(process.cwd(), 'frontend'), 'Frontend Dependencies');
    }

    console.log('\n🎉 All dependencies installed!');
    console.log('\n📱 Frontend will be available at: http://localhost:3000');
    console.log('🔧 Backend API will be available at: http://localhost:5000');
    console.log('\n⚠️  Make sure MongoDB is running on your system');
    console.log('   - On macOS: brew services start mongodb-community');
    console.log('   - On Ubuntu: sudo systemctl start mongod');
    console.log('   - On Windows: net start MongoDB');
    console.log('\n🚀 Starting both servers...\n');

    // Start both servers concurrently
    const backend = spawn('npm', ['run', 'dev'], { 
      cwd: path.join(process.cwd(), 'backend'), 
      stdio: 'inherit',
      shell: true 
    });

    const frontend = spawn('npm', ['start'], { 
      cwd: path.join(process.cwd(), 'frontend'), 
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

  } catch (error) {
    console.error('❌ Error starting project:', error.message);
    process.exit(1);
  }
}

startProject();
