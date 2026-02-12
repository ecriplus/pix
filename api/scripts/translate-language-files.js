// eslint-disable-next-line n/no-missing-import
import 'json-autotranslate';

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { Script } from '../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../src/shared/application/scripts/script-runner.js';

export class TranslateLanguageFiles extends Script {
  constructor() {
    super({
      description: 'This script is used to create/update translation files from a source translation file.',
      permanent: true,
      options: {
        dir: {
          type: 'string',
          describe:
            'Translations directory (source language file is required; target language file will be created if missing)',
          demandOption: true,
        },
        sourceLang: {
          type: 'string',
          describe: 'Source language : for example fr, en, it, es',
          default: 'fr',
        },
        targetLang: {
          type: 'string',
          describe: 'Target language : for example it, en, es',
          demandOption: true,
        },
        formality: {
          type: 'string',
          describe: 'DeepL formality: default|more|less',
          default: 'default',
        },
        batchSize: {
          type: 'number',
          describe: 'DeepL batch size',
          default: 500,
        },
        dryRun: {
          type: 'boolean',
          describe: 'If true: Write in files',
          default: false,
        },
      },
    });
  }

  async handle({ options, logger }) {
    const { dir, sourceLang, targetLang, formality, batchSize, dryRun } = options;

    const deeplKey = process.env.DEEPL_API_KEY;
    if (!deeplKey) {
      throw new Error('DEEPL KEY NOT FOUND');
    }

    const sourcePath = path.join(dir, `${sourceLang}.json`);
    const targetPath = path.join(dir, `${targetLang}.json`);

    const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'json-autotranslate-'));
    const tmpSourcePath = path.join(tmpDir, `${sourceLang}.json`);
    const tmpTargetPath = path.join(tmpDir, `${targetLang}.json`);

    const execute = 'npx';
    const args = [
      'json-autotranslate',
      '-s',
      'deepl-free',
      '-i',
      tmpDir,
      '-l',
      sourceLang,
      '--directory-structure',
      'ngx-translate',
      '--type',
      'key-based',
      '--config',
      `${deeplKey},${formality},${batchSize}`,
    ];
    const commandForLog = `${execute} ${args.join(' ')}`;

    try {
      logger.info(`Temp dir: ${tmpDir}`);
      logger.info(`Real source: ${sourcePath}`);
      logger.info(`Real target: ${targetPath}`);
      if (dryRun) {
        logger.info(`DryRun - will run: ${commandForLog}`);
        return;
      }
      await fs.promises.copyFile(sourcePath, tmpSourcePath);
      try {
        await fs.promises.copyFile(targetPath, tmpTargetPath);
      } catch (err) {
        if (err.code === 'ENOENT') {
          await fs.promises.writeFile(tmpTargetPath, '{}\n', 'utf-8');
        } else {
          throw err;
        }
      }

      logger.info(`Running: ${commandForLog}`);
      await run(execute, args);
      await fs.promises.copyFile(tmpTargetPath, targetPath);
      logger.info(`Updated target: ${targetPath}`);
    } finally {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
      logger.info(`Temp dir deleted: ${tmpDir}`);
    }
  }
}
function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with code ${code}`));
    });
  });
}

await ScriptRunner.execute(import.meta.url, TranslateLanguageFiles);
