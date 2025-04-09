import { exec } from 'child_process';
import { createInterface } from 'readline';

console.log('🚀 Starting the Local Connect application...');

// Track server startup
let serverStarted = false;
let clientStarted = false;

// Start the server
console.log('📡 Starting Stripe server...');
const server = exec('npm run server');

// Forward server output to console
server.stdout.on('data', (data) => {
  const output = data.trim();
  console.log(`[SERVER]: ${output}`);
  
  // Check if server has started successfully
  if (output.includes('Stripe server running on port') && !serverStarted) {
    serverStarted = true;
    startClient();
  }
});

server.stderr.on('data', (data) => {
  console.error(`[SERVER ERROR]: ${data.trim()}`);
});

server.on('error', (err) => {
  console.error('Failed to start server process:', err);
  process.exit(1);
});

function startClient() {
  // Start the client
  console.log('💻 Starting client application...');
  const client = exec('npm run dev');

  // Forward client output to console
  client.stdout.on('data', (data) => {
    const output = data.trim();
    console.log(`[CLIENT]: ${output}`);
    
    // Check if client has started successfully
    if (output.includes('Local:') && !clientStarted) {
      clientStarted = true;
      console.log('\n✅ Application is now running!');
      console.log('Press Ctrl+C to stop both server and client\n');
    }
  });

  client.stderr.on('data', (data) => {
    console.error(`[CLIENT ERROR]: ${data.trim()}`);
  });

  client.on('error', (err) => {
    console.error('Failed to start client process:', err);
    server.kill();
    process.exit(1);
  });

  // Handle process termination
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Handle cleanup on exit
  process.on('SIGINT', () => {
    console.log('\n👋 Gracefully shutting down...');
    server.kill();
    client.kill();
    rl.close();
    process.exit(0);
  });
}

// Set a timeout to prevent hanging if server doesn't start properly
setTimeout(() => {
  if (!serverStarted) {
    console.error('Server startup timed out after 10 seconds. Check server logs for errors.');
    server.kill();
    process.exit(1);
  }
}, 10000); 