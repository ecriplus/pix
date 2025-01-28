import fs from 'node:fs';
import path from 'node:path';

import { Script } from '../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../src/shared/application/scripts/script-runner.js';

export class UpdateTranslations extends Script {
  constructor() {
    super({
      description: 'This script is used to update the translations in the application',
      permanent: true,
      options: {
        source: {
          type: 'string',
          describe: 'The source file',
          demandOption: true,
        },
        targets: {
          type: 'array',
          describe: 'The list of target files.',
          demandOption: true,
        },
        dryRun: {
          type: 'boolean',
          describe: 'If true: Write in files',
          default: false,
        },
      },
    });
    this.informations = {
      new: 0,
      old: 0,
      write: 0,
      delete: 0,
    };
  }

  async handle({ options, logger }) {
    const { source, targets, dryRun } = options;
    this.checkExtension(source, targets);
    const sourceFile = await this.readAndConvertFile(source);
    for (const target of targets) {
      logger.info(`Runs on ${target}`);
      const targetFile = await this.readAndConvertFile(target);
      const updater = this.checkAndUpdate({ baseLanguage: sourceFile, targetLanguage: targetFile, logger, dryRun });
      const withoutOld = this.clearOldValues({ baseLanguage: sourceFile, targetLanguage: updater, logger, dryRun });
      if (!dryRun) {
        await this.writeFile(target, withoutOld);
      }
      logger.info(
        `Done with ${this.informations.new} new key found, ${this.informations.write} written, ${this.informations.old} old translation and ${this.informations.delete} deleted.`,
      );
      this.informations = {
        new: 0,
        old: 0,
        write: 0,
        delete: 0,
      };
    }
  }

  checkExtension(source, targets) {
    const sourceExtension = path.extname(source);
    if (sourceExtension !== '.json') {
      throw new Error('The source file must be a JSON file');
    }
    if (targets.map((target) => path.extname(target)).some((ext) => ext !== '.json')) {
      throw new Error('All target files must be JSON files');
    }
    return true;
  }

  async readAndConvertFile(filePath) {
    const file = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(file);
  }

  async writeFile(filePath, content) {
    await fs.promises.writeFile(filePath, JSON.stringify(content, null, 2));
  }

  checkAndUpdate({ baseLanguage, targetLanguage, dryRun, logger }) {
    for (const key in baseLanguage) {
      if (typeof baseLanguage[key] === 'object') {
        targetLanguage[key] = this.checkAndUpdate({
          baseLanguage: baseLanguage[key],
          targetLanguage: targetLanguage[key] || {},
          logger,
          dryRun,
        });
      } else {
        if (!targetLanguage[key]) {
          logger.info(`New key found: ${key}`);
          if (!dryRun) {
            targetLanguage[key] = `*${baseLanguage[key]}`;
            this.informations.write++;
          }
          this.informations.new++;
        }
      }
    }
    return targetLanguage;
  }

  clearOldValues({ baseLanguage, targetLanguage, logger, dryRun }) {
    for (const key in targetLanguage) {
      if (typeof targetLanguage[key] === 'object') {
        targetLanguage[key] = this.clearOldValues({
          baseLanguage: baseLanguage[key] || {},
          targetLanguage: targetLanguage[key],
          logger,
          dryRun,
        });
      }
      if (!baseLanguage[key]) {
        logger.info(`Old key found: ${key}`);
        if (!dryRun) {
          delete targetLanguage[key];
          this.informations.delete++;
        }
        this.informations.old++;
      }
    }
    return targetLanguage;
  }
}

await ScriptRunner.execute(import.meta.url, UpdateTranslations);
