import { exit } from 'node:process';
import { setTimeout } from 'node:timers/promises';

import packageJson from '../package.json' with { type: 'json' };

const apiUrl = process.env.PIX_API_URL;
const expectedVersion = packageJson.version;

const apiInfoURL = new URL('/api', apiUrl);

while (true) {
  const apiInfo = await fetchApiInfoURL();

  if (apiInfo?.version === expectedVersion) {
    exit(0);
  }

  await setTimeout(10_000);
}

async function fetchApiInfoURL() {
  console.info('Fetching', apiInfoURL.href);

  const res = await fetch(apiInfoURL);
  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }

    throw new Error(`Pix API responded with ${res.statusText}`);
  }

  return res.json();
}
