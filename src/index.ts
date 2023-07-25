import { input } from '@inquirer/prompts';
import { dirname, resolve } from 'node:path';
import { cp, readFile, writeFile, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const projectDir = await input({
  message: 'Project name:',
  default: 'node-project',
});

const absolutePath = resolve(projectDir);
console.log(`\nScaffolding project in ${absolutePath}...\n`);

const srcDir = fileURLToPath(dirname(import.meta.url));
await cp(`${srcDir}/../templates/vanilla-ts/`, projectDir, {
  recursive: true,
});

// Can't just have .gitignore in template because of bug with npm publish
// See https://github.com/npm/npm/issues/3763
await rename(`${projectDir}/gitignore`, `${projectDir}/.gitignore`);

// From https://github.com/vitejs/vite/tree/main/packages/create-vite
const packageName = projectDir
  .trim()
  .toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/^[._]/, '')
  .replace(/[^a-z\d\-~]+/g, '-');

const packageContents = await readFile(`${projectDir}/package.json`, {
  encoding: 'utf8',
});

// Replace the temp "name" field in package.json
const newContents = packageContents.replace(
  /  "name": "(.*)",\n/,
  `  "name": "${packageName}",\n`
);

await writeFile(`${projectDir}/package.json`, newContents);

console.log('Done. Now run:\n');
console.log(`  cd ${projectDir}`);
console.log(`  npm install`);
console.log(`  npm run dev\n`);
