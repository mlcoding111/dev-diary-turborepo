#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import Mustache from 'mustache';
import { execSync } from 'child_process';

const CONFIG = {
  outputDirs: {
    models: path.join(__dirname, '../../src/models'),
    entities: path.join(__dirname, '../../src/entities'),
    schemas: path.join(__dirname, '../../../../packages/types/src/schema'),
  },
  moduleFile: path.join(__dirname, '../models/index.ts'),
};

// 🚀 Convert "my_model" → "MyModel"
const toPascalCase = (str: string) =>
  str
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');

const toKebabCase = (str: string) => str.replace(/_/g, '-');
const toSlugCase = (str: string) => str.replace(/_/g, '-').replace(/\s+/g, '-');
const toLowerCamelCase = (str: string) =>
  str.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toLowerCase());

// 🛠️ CLI Arguments Parsing
const args = process.argv.slice(2);
const modelName = args.find(
  (arg) => !arg.startsWith('--') && !arg.startsWith('model'),
);

// ✅ Extract `--filter ignore` and `--filter only`
const filterArgs =
  args.join(' ').match(/--filter (ignore|only) ([\w,]+)/g) || [];
let ignoredFiles: string[] = [];
let onlyFiles: string[] = [];

filterArgs.forEach((arg) => {
  const [, type, files] = arg.split(' ');
  if (type === 'ignore') ignoredFiles = files?.split(',') || [];
  if (type === 'only') onlyFiles = files?.split(',') || [];
});

if (!modelName) {
  console.error(
    '❌ Missing model name.\nUsage: pnpm run generate <model_name> [--filter ignore file1,file2] [--filter only file1,file2]',
  );
  process.exit(1);
}

const className = toPascalCase(modelName);
const modelDir = path.join(CONFIG.outputDirs.models, toSlugCase(modelName));
const modelNameCamelCase = toLowerCamelCase(modelName);
const entityDir = CONFIG.outputDirs.entities;

const moduleFileName = `${toKebabCase(modelName)}.module.ts`;
const moduleImportPath = `./${toKebabCase(modelName)}/${moduleFileName.replace('.ts', '')}`;

// Ensure directories exist asynchronously
const ensureDirs = async () => {
  await Promise.all([
    fs.mkdir(modelDir, { recursive: true }),
    fs.mkdir(entityDir, { recursive: true }),
  ]);
};

// 🎯 Files to Generate
const files = [
  { name: 'service.ts', outputDir: modelDir },
  { name: 'controller.ts', outputDir: modelDir },
  { name: 'subscriber.ts', outputDir: modelDir },
  { name: 'repository.ts', outputDir: modelDir },
  { name: 'listener.ts', outputDir: modelDir },
  { name: 'module.ts', outputDir: modelDir },
  { name: 'entity.ts', outputDir: entityDir },
  { name: 'schema.ts', outputDir: CONFIG.outputDirs.schemas },
];

const generatedFiles: string[] = [];

// 🔥 Generate Files
const generateFiles = async () => {
  await ensureDirs();

  await Promise.all(
    files.map(async ({ name, outputDir }) => {
      if (
        onlyFiles.length > 0 &&
        !onlyFiles.includes(name.replace('.ts', ''))
      ) {
        console.log(`🚫 Skipping (not in --only): ${name}`);
        return;
      }

      if (ignoredFiles.some((ignored) => name.includes(ignored))) {
        console.log(`🚫 Skipping (in --ignore): ${name}`);
        return;
      }

      const templatePath = path.join(
        __dirname,
        `../templates/${toSlugCase(name)}.mustache`,
      );
      const outputPath = path.join(
        outputDir,
        `${toKebabCase(modelName)}.${name}`,
      );

      try {
        const template = await fs.readFile(templatePath, 'utf-8');
        const content = Mustache.render(template, {
          modelName,
          className,
          modelNameCamelCase,
        });
        await fs.writeFile(outputPath, content);

        console.log(`✅ Generated: ${outputPath}`);
        generatedFiles.push(outputPath);
      } catch (error) {
        console.error(`❌ Error generating ${outputPath}:`, error);
      }
    }),
  );
};

// 🎨 Format Generated Files in One Command
const formatFiles = () => {
  if (generatedFiles.length > 0) {
    try {
      const formattedPaths = generatedFiles
        .map((file) => `"${file}"`)
        .join(' ');
      execSync(`pnpm prettier --write ${formattedPaths}`, { stdio: 'inherit' });
      console.log(
        `🎨 Formatting of (${generatedFiles.length}) files completed successfully!`,
      );
    } catch (error) {
      console.error('⚠️ Prettier failed:', error);
    }
  }
};

// 📌 Update `app.module.ts`
const updateModuleExports = async () => {
  const filePath = CONFIG.moduleFile;

  try {
    let fileContent = await fs.readFile(filePath, 'utf-8');

    // Import statement
    const importStatement = `import { ${className}Module } from '${moduleImportPath}';`;
    if (!fileContent.includes(importStatement)) {
      fileContent = `${importStatement}\n${fileContent}`;
    }

    // Update exported array
    const exportRegex = /export\s+default\s+\[([\s\S]*?)\];/;
    const match = fileContent.match(exportRegex);

    if (match) {
      const existingModules = match[1]?.trim();
      if (!existingModules?.includes(`${className}Module`)) {
        const updatedModules = `${existingModules}, ${className}Module`;
        fileContent = fileContent.replace(
          exportRegex,
          `export default [${updatedModules}];`,
        );
      }
    } else {
      console.error('⚠️ Could not find the export default array.');
      return;
    }

    // Write back the updated file
    await fs.writeFile(filePath, fileContent, 'utf-8');
    console.log(`🔄 Successfully added ${className}Module to app.module.ts`);
  } catch (error) {
    console.error(`❌ Error updating app.module.ts:`, error);
  }
};

const main = async () => {
  await generateFiles();
  await updateModuleExports();
  formatFiles();
};

main();
