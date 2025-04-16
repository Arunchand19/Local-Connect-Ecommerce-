import { exec } from 'child_process';
import { createInterface } from 'readline';

console.log('🚀 Starting the Local Connect application...');

// Track server startup
let serverStarted = false;
let clientStarted = false;

// Start the Stripe server
console.log('📡 Starting Stripe server...');
const stripeServer = exec('npm run server');

// Start the API server
console.log('🌐 Starting API server...');
const apiServer = exec('npm run api-server');

let stripeServerStarted = false;
let apiServerStarted = false;

// Forward Stripe server output to console
stripeServer.stdout.on('data', (data) => {
  const output = data.trim();
  console.log(`[STRIPE SERVER]: ${output}`);
  
  // Check if Stripe server has started successfully
  if (output.includes('Stripe server running on port') && !stripeServerStarted) {
    stripeServerStarted = true;
    checkAllServersStarted();
  }
});

stripeServer.stderr.on('data', (data) => {
  console.error(`[STRIPE SERVER ERROR]: ${data.trim()}`);
});

stripeServer.on('error', (err) => {
  console.error('Failed to start Stripe server process:', err);
  process.exit(1);
});

// Forward API server output to console
apiServer.stdout.on('data', (data) => {
  const output = data.trim();
  console.log(`[API SERVER]: ${output}`);
  
  // Check if API server has started successfully
  if (output.includes('Server running on port') && !apiServerStarted) {
    apiServerStarted = true;
    checkAllServersStarted();
  }
});

apiServer.stderr.on('data', (data) => {
  console.error(`[API SERVER ERROR]: ${data.trim()}`);
});

apiServer.on('error', (err) => {
  console.error('Failed to start API server process:', err);
  process.exit(1);
});

// Function to check if all servers have started
function checkAllServersStarted() {
  if (stripeServerStarted && apiServerStarted && !serverStarted) {
    serverStarted = true;
    startClient();
  }
}

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
    stripeServer.kill();
    apiServer.kill();
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
    stripeServer.kill();
    apiServer.kill();
    client.kill();
    rl.close();
    process.exit(0);
  });
}

// Set a timeout to prevent hanging if servers don't start properly
setTimeout(() => {
  if (!serverStarted) {
    console.error('Server startup timed out after 10 seconds. Check server logs for errors.');
    stripeServer.kill();
    apiServer.kill();
    process.exit(1);
  }
}, 10000); 