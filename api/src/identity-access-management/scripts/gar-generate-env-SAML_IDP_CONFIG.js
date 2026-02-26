import { readFile } from 'node:fs/promises';

const metadataIdpfilePath = process.argv[2];
if (!metadataIdpfilePath) {
  throw new Error('An XML file (typically named "metadata" or "metadata.xml") must be provided.');
}

// eslint-disable-next-line no-console
console.log(
  `SAML_IDP_CONFIG=${JSON.stringify({
    metadata: await getInlineContent(metadataIdpfilePath),
  })}`,
);

function getInlineContent(filePath) {
  return readFile(filePath, 'utf-8').then((str) => {
    return str.replace(/^\s+|\s+$|\n/gm, '');
  });
}
