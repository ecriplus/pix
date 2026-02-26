import { readFile } from 'node:fs/promises';

const metadataSpfilePath = process.argv[2];
if (!metadataSpfilePath) {
  throw new Error('An XML file (typically named "metadata_sp" or "metadata_sp.xml") must be provided.');
}

const privateKeyfilePath = process.argv[3];
if (!privateKeyfilePath) {
  throw new Error('A private key file (typically named "privatekey.pem") must be provided.');
}

// eslint-disable-next-line no-console
console.log(
  `SAML_SP_CONFIG=${JSON.stringify({
    metadata: await getInlineContent(metadataSpfilePath),
    encPrivateKey: await readFile(privateKeyfilePath, 'utf-8'),
  })}`,
);

function getInlineContent(filePath) {
  return readFile(filePath, 'utf-8').then((str) => {
    return str.replace(/^\s+|\s+$|\n/gm, '');
  });
}
