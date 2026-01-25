import { spawnSync } from 'child_process';

const args = process.argv.slice(2);
const testRef = args.find((a) => !a.startsWith('--'));
const snapshotMode = args.includes('--snapshot');

if (!testRef) {
  // eslint-disable-next-line no-console
  console.error(
    '❌ Please provide a test reference.\n' +
      'Usage:\n' +
      '  npm run test:certif:testref MyTestRef\n' +
      '  npm run test:certif:snapshot:testref MyTestRef',
  );
  process.exit(1);
}

const env = snapshotMode ? { ...process.env, UPDATE_SNAPSHOTS: 'true' } : process.env;
const command = ['npx', 'playwright', 'test', '--config', 'playwright.config.certif.ts', '--grep', testRef];

// eslint-disable-next-line no-console
console.log(`🚀 Running: ${command.join(' ')}`);

const result = spawnSync(command[0], command.slice(1), {
  stdio: 'inherit',
  env,
});

process.exit(result.status ?? 1);
