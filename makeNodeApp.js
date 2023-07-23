import { input } from '@inquirer/prompts';
import { resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

const projectDir = await input({
  message: 'Project name:',
  default: 'node-project',
});

const absolutePath = resolve(projectDir);
console.log(`\nScaffolding project in ${absolutePath}...\n`);

// From https://github.com/vitejs/vite/tree/main/packages/create-vite
const packageName = projectDir
  .trim()
  .toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/^[._]/, '')
  .replace(/[^a-z\d\-~]+/g, '-');

const packageContents = `{
  "name": "${packageName}",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "start": "tsc && node dist/main.js"
  },
  "devDependencies": {
    "typescript": "^5.1.6"
  },
  "dependencies": {
    "@types/node": "^20.4.4"
  }
}
`;

const tsconfigContents = `{
  "compilerOptions": {
    "lib": ["es2023"],
    "module": "Node16",
    "target": "es2022",

    "outDir": "dist",

    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node16"
  },
  "include": ["src/**/*"]
}
`;

const gitignoreContents = `node_modules
dist

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`;

const mainContents = `console.log('Hello, World!');
`;

await mkdir(projectDir, { recursive: true });
await writeFile(`${projectDir}/package.json`, packageContents);
await writeFile(`${projectDir}/tsconfig.json`, tsconfigContents);
await writeFile(`${projectDir}/.gitignore`, gitignoreContents);

await mkdir(`${projectDir}/src`, { recursive: true });
await writeFile(`${projectDir}/src/main.ts`, mainContents);

console.log('Done. Now run:\n');
console.log(`  cd ${projectDir}`);
console.log(`  npm install`);
console.log(`  npm run start\n`);
