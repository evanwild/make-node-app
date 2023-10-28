#!/usr/bin/env node

import { input } from '@inquirer/prompts';
import path, { resolve } from 'node:path';
import { cpSync, renameSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const projectDir = await input({
  message: 'Project name:',
  default: 'node-project',
});

const absolutePath = resolve(projectDir);
console.log(`\nScaffolding project in ${absolutePath}...\n`);

const thisScriptDir = path.dirname(fileURLToPath(import.meta.url));
cpSync(`${thisScriptDir}/template-vanilla-ts/`, projectDir, {
  recursive: true,
});

// Can't just have .gitignore in template because of bug with npm publish
// See https://github.com/npm/npm/issues/3763
renameSync(`${projectDir}/_gitignore`, `${projectDir}/.gitignore`);

const packageJson = readFileSync(`${projectDir}/package.json`, {
  encoding: 'utf8',
});

// From https://github.com/vitejs/vite/tree/main/packages/create-vite
const packageName = projectDir
  .trim()
  .toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/^[._]/, '')
  .replace(/[^a-z\d\-~]+/g, '-');

// Replace the temp "name" field in package.json
const newContents = packageJson.replace(
  /"name": "(.*)"/,
  `"name": "${packageName}"`
);

writeFileSync(`${projectDir}/package.json`, newContents);

console.log('Done. Now run:\n');
console.log(`  cd ${projectDir}`);
console.log(`  npm install`);
console.log(`  npm run dev\n`);
