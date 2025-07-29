/* eslint-disable no-sync */
import fs from 'node:fs';
import { builtinModules } from 'node:module';
import path from 'node:path';

import { init, parse } from 'es-module-lexer';
import { glob } from 'glob';

import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';

await init;

export class CheckApiDependencyViolations extends Script {
  constructor() {
    super({
      description: 'Check API dependency violations between contexts [dev only]',
      permanent: false,
      options: {
        report: {
          type: 'string',
          choices: ['json', 'md'],
          describe: 'Report output file type',
          requiresArg: true,
          default: 'json',
        },
        context: {
          type: 'string',
          describe: 'Filter with an API context name',
          requiresArg: true,
        },
      },
    });
  }

  async handle({ options, logger }) {
    config.basePath = path.resolve(import.meta.dirname, '../..');
    if (!config.basePath.endsWith('/api')) {
      throw new Error('Pix API folder not found.');
    }

    const excludedModules = [...getNodeModules(config), ...getBuiltinModules()];
    const excludedPath = [...getExcludedPath(config), ...getExcludedApisPath(config)];

    const violationsByEntry = new Map();
    for (const entryPath of config.entries) {
      if (options.context && !entryPath.startsWith(`src/${options.context}`)) {
        continue;
      }

      const violationsByFile = await checkDependencyViolations(
        config.basePath,
        entryPath,
        excludedModules,
        excludedPath,
      );
      violationsByEntry.set(entryPath, violationsByFile);
    }

    const stats = computeGlobalStats(violationsByEntry);

    let content = null;
    if (options.report === 'json') {
      content = JSON.stringify({ stats, violations: Object.fromEntries(violationsByEntry) });
    } else if (options.report === 'md') {
      content = reportToMarkdown(stats, violationsByEntry);
    }

    if (content) {
      const reportFile = `${config.basePath}/dependencies-violations.${options.report}`;
      fs.writeFileSync(reportFile, content);
      logger.info(`Generating report file: ${reportFile}`);
    }
  }
}

const config = {
  entries: [
    'src/authorization',
    'src/banner',
    'src/certification/complementary-certification',
    'src/certification/configuration',
    'src/certification/enrolment',
    'src/certification/evaluation',
    'src/certification/results',
    'src/certification/scoring',
    'src/certification/session-management',
    'src/certification/shared',
    'src/devcomp',
    'src/evaluation',
    'src/identity-access-management',
    'src/learning-content',
    'src/legal-documents',
    'src/maddo',
    'src/monitoring',
    'src/organizational-entities',
    'src/prescription/campaign',
    'src/prescription/campaign-participation',
    'src/prescription/learner-management',
    'src/prescription/organization-learner',
    'src/prescription/organization-learner-feature',
    'src/prescription/organization-place',
    'src/prescription/scripts',
    'src/prescription/shared',
    'src/prescription/target-profile',
    'src/privacy',
    'src/profile',
    'src/quest',
    'src/school',
    'src/shared',
    'src/team',
  ],
  exclude: [
    'db',
    'config',
    'src/shared',
    'src/certification/shared',
    'src/prescription/shared',
    'translations',
    'package.json',
  ],
};

function getNodeModules(config) {
  const nodeModulesPath = path.join(config.basePath, 'node_modules');
  const folderContent = fs.readdirSync(nodeModulesPath);
  return folderContent.filter((file) => fs.statSync(path.join(nodeModulesPath, file)).isDirectory());
}

function getBuiltinModules() {
  return [...builtinModules, ...builtinModules.map((module) => `node:${module}`)];
}

function getExcludedPath(config) {
  return config.exclude.map((folderPath) => path.resolve(config.basePath, folderPath));
}

function getExcludedApisPath(config) {
  return config.entries.map((entryPath) => path.resolve(config.basePath, entryPath, 'application/api'));
}

async function checkDependencyViolations(basePath, entryPath, excludedModules, excludedPath) {
  const entryAbsolutePath = path.resolve(basePath, entryPath);
  const globPath = path.join(entryAbsolutePath, '**/*.js');
  const files = await glob(globPath);

  const violationsByFile = {};

  for (const file of files) {
    const source = fs.readFileSync(file, { encoding: 'utf-8' });
    const [dependencies] = parse(source);

    for (const dependency of dependencies) {
      const name = dependency.n;

      if (!name) continue;

      if (excludedModules.includes(name)) continue;

      const dependencyAbsolutePath = path.resolve(path.dirname(file), name);

      if (excludedPath.some((p) => dependencyAbsolutePath.startsWith(p))) continue;

      if (dependencyAbsolutePath.startsWith(entryAbsolutePath)) continue;

      const line = source.slice(dependency.ss, dependency.se).replaceAll('\n', '');

      const relativeFilePath = path.relative(basePath, file);
      if (violationsByFile[relativeFilePath]) {
        violationsByFile[relativeFilePath].push(line);
      } else {
        violationsByFile[relativeFilePath] = [line];
      }
    }
  }
  return violationsByFile;
}

function computeGlobalStats(violationsByEntry) {
  let totalFiles = 0;

  const entries = {};
  violationsByEntry.forEach((violationsByFile, entryPath) => {
    const violationsByFileEntries = Object.entries(violationsByFile);
    entries[entryPath] = violationsByFileEntries.length;
    totalFiles += violationsByFileEntries.length;
  });

  return { totalFiles, entries };
}

function reportToMarkdown(stats, violationsByEntry) {
  let content = '';
  content += '# Dependency violations report\n\n';

  content += `| Entries | Files with violations |\n`;
  content += `| --- | --- |\n`;
  for (const [entryPath, totalFiles] of Object.entries(stats.entries)) {
    content += `| [${entryPath}](#${entryPath}) | ${totalFiles} |\n`;
  }
  content += `| **Total** | **${stats.totalFiles}** |\n`;

  content += '# Entries\n\n';
  violationsByEntry.forEach((violationsByFile, entryPath) => {
    const violationsByFileEntries = Object.entries(violationsByFile);
    if (violationsByFileEntries.length > 0) {
      content += `## ${entryPath}\n\n`;
      for (const [file, violations] of violationsByFileEntries) {
        content += '```javascript\n';
        content += `// ${file}\n`;
        for (const violation of violations) {
          content += `${violation}\n`;
        }
        content += '```\n\n';
      }
    }
  });
  return content;
}

await ScriptRunner.execute(import.meta.url, CheckApiDependencyViolations);
/* eslint-enable no-sync */
