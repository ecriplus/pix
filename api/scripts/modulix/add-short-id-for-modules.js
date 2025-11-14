import { randomBytes } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import * as url from 'node:url';

const modulesPath = url.fileURLToPath(
  new URL('../../../api/src/devcomp/infrastructure/datasources/learning-content/modules', import.meta.url),
);
const moduleNames = readdirSync(modulesPath);
moduleNames.forEach((moduleName) => {
  const fileData = readFileSync(`${modulesPath}/${moduleName}`, 'utf8');
  const jsonParsed = JSON.parse(fileData);
  if (!Object.keys(jsonParsed).includes('shortId')) {
    const moduleWithShortId = { id: jsonParsed.id, shortId: randomBytes(4).toString('hex') };
    delete jsonParsed['id'];
    const finalModule = { ...moduleWithShortId, ...jsonParsed };
    writeFileSync(`${modulesPath}/${moduleName}`, JSON.stringify(finalModule, null, 2));
  }
});
