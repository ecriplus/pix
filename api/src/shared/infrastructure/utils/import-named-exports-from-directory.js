import { readdir } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export async function importNamedExportsFromDirectory({ path, ignoredFileNames = [] }) {
  const imports = {};
  const exportsLocations = {};
  const files = await readdir(path, { withFileTypes: true });

  const appelantDir = getAppelantUrl();

  const importLogs = [];
  for (const file of files) {
    if (file.isDirectory()) {
      continue;
    }

    if (!file.name.endsWith('.js') || ignoredFileNames.includes(file.name)) {
      continue;
    }

    const fileURL = pathToFileURL(join(path, file.name));
    const module = await import(fileURL);
    const namedExports = Object.entries(module);
    const fileExports = {};

    for (const [exportName, exportedValue] of namedExports) {
      if (exportName === 'default') {
        continue;
      }
      if (imports[exportName]) {
        throw new Error(`Duplicate export name ${exportName} : ${exportsLocations[exportName]} and ${file.name}`);
      }
      imports[exportName] = exportedValue;
      fileExports[exportName] = exportedValue;
      exportsLocations[exportName] = file.name;
    }

    const moduleAbs = fileURLToPath(fileURL);
    let relativePath = relative(appelantDir, moduleAbs);
    if (!relativePath.startsWith('.')) {
      relativePath = './' + relativePath;
    }

    importLogs.push(`import { ${Object.keys(fileExports).join(', ')} } from '${relativePath}';`);
  }

  console.log(`\n\n\n IMPORT DYNAMIQUE DEPUIS ${appelantDir}`);
  console.log(importLogs.join('\n'));
  console.log('\n');
  console.log(`const usecasesWithoutInjectedDependencies = {
    ${Object.keys(imports).join(',\n')}
   };`);
  return imports;
}

function getAppelantUrl() {
  const err = new Error();
  const stack = err.stack.split('\n');
  // console.log(stack.slice(0, 4));
  const line = stack[3];
  const match = line.match(/\((file:\/\/\/?.*):\d+:\d+\)/) || line.match(/at (?:async )?(file:\/\/\/?.*):\d+:\d+/);
  if (!match) {
    return '';
  }

  let appelantAbs = match[1];
  if (appelantAbs.startsWith('file://')) {
    appelantAbs = fileURLToPath(appelantAbs);
  }
  return dirname(appelantAbs);
}

export async function importNamedExportFromFile(filepath) {
  const fileURL = pathToFileURL(filepath);
  const module = await import(fileURL);
  const namedExports = Object.entries(module);

  return namedExports
    .filter(([exportName]) => exportName !== 'default')
    .reduce((exports, [exportName, exportedValue]) => {
      exports[exportName] = exportedValue;
      return exports;
    }, {});
}
