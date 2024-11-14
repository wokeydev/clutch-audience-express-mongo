import { execSync } from 'child_process';
import dotenv from 'dotenv';
import util from 'util';

dotenv.config({ path: '.env.test' });

const exec = util.promisify(execSync);

const startDocker = async () => {
  console.log('Starting MongoDB Docker container...');
  exec('docker-compose -f docker-compose.test.yml up -d', { stdio: 'inherit' });
  console.log('Waiting for MongoDB to be ready...');
  await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait for 10 seconds
};

const stopDocker = async () => {
  console.log('Stopping MongoDB Docker container...');
  exec('docker-compose -f docker-compose.test.yml down --volumes', {
    stdio: 'inherit',
  });
};

(async () => {
  try {
    await startDocker();

    console.log('Running tests...');
    execSync('jest --runInBand --detectOpenHandles --forceExit', {
      stdio: 'inherit',
    });
  } catch (error) {
    console.error('Error during tests:', error);
  } finally {
    await stopDocker();
  }
})();
