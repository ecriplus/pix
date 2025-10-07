import * as url from 'node:url';

import jsdocToMarkdown from 'jsdoc-to-markdown';

async function main(baseFolder) {
  const docs = await jsdocToMarkdown.render({ files: `${baseFolder}/**/application/api/**/*.js` });

  console.log(
    `This doc has been generated on ${new Date().toLocaleString()} with \`scripts/generate-api-documentation.js\`. See package.json.`,
  );
  console.log('\n---');
  console.log(docs);
}

const modulePath = url.fileURLToPath(import.meta.url);
const isLaunchedFromCommandLine = process.argv[1] === modulePath;

(async () => {
  if (isLaunchedFromCommandLine) {
    try {
      await main(process.argv[2]);
    } catch (error) {
      console.error(error);
      process.exitCode = 1;
    }
  }
})();
