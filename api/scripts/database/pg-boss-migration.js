import { spawn } from 'node:child_process';

const { NODE_ENV, JOBS_DATABASE_URL, TEST_JOBS_DATABASE_URL } = process.env;
const CONNECTION_STRING = NODE_ENV === 'test' ? TEST_JOBS_DATABASE_URL : JOBS_DATABASE_URL;

console.log(`Run pg-boss migrations"`);
execute(`npx pg-boss migrate --connection-string=${CONNECTION_STRING}`);

function execute(scriptCommands = [], options = {}) {
  return new Promise((resolve, reject) => {
    const npmExec = spawn(scriptCommands, {
      cwd: options.cwd || process.cwd(),
      stdio: 'inherit',
      shell: true,
    });

    npmExec.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${scriptCommands} failed with code ${code}`));
      }
    });
  });
}
