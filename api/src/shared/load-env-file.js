import { existsSync } from 'node:fs';
import * as url from 'node:url';

const envFilePath = url.fileURLToPath(new URL('../../.env', import.meta.url));

export function loadEnvFile() {
  if (existsSync(envFilePath)) {
    process.loadEnvFile(envFilePath);
  }
}
