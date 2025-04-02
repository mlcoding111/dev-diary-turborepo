#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import Mustache from 'mustache';

// 🛠️ Configuration: Define output directories
const CONFIG = {
  outputDirs: {
    models: path.join(__dirname, '../../src/models'),
    entities: path.join(__dirname, '../../src/entities'),
  },
};

// 🚀 Convert "my_model" → "MyModel"
const toPascalCase = (str: string) =>
  str
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');

const toKebabCase = (str: string) => str.replace(/_/g, '-');
// Convert "my_model" → "my-model"
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

console.log('MODEL NAME', modelName);

const className = toPascalCase(modelName);
const modelDir = path.join(CONFIG.outputDirs.models, toSlugCase(modelName));
const modelNameCamelCase = toLowerCamelCase(modelName);
console.log('MODEL NAME CAMEL CASE', modelNameCamelCase);
const entityDir = CONFIG.outputDirs.entities;

// Ensure directories exist
if (!fs.existsSync(modelDir)) fs.mkdirSync(modelDir, { recursive: true });
if (!fs.existsSync(entityDir)) fs.mkdirSync(entityDir, { recursive: true });

// 🎯 Files to Generate (custom paths)
const files = [
  { name: 'service.ts', outputDir: modelDir },
  { name: 'controller.ts', outputDir: modelDir },
  { name: 'subscriber.ts', outputDir: modelDir },
  { name: 'repository.ts', outputDir: modelDir },
  { name: 'listener.ts', outputDir: modelDir },
  { name: 'module.ts', outputDir: modelDir },
  { name: 'entity.ts', outputDir: entityDir }, // Entity stored separately
];

// 🔥 Generate Files (skipping ignored ones)
files.forEach(({ name, outputDir }) => {
  if (onlyFiles.length > 0 && !onlyFiles.includes(name.replace('.ts', ''))) {
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
  const outputPath = path.join(outputDir, `${toKebabCase(modelName)}.${name}`);

  if (fs.existsSync(templatePath)) {
    const template = fs.readFileSync(templatePath, 'utf-8');
    const content = Mustache.render(template, {
      modelName,
      className,
      modelNameCamelCase,
    });
    fs.writeFileSync(outputPath, content);
    console.log(`✅ Generated: ${outputPath}`);
  }
});

console.log('\n🚀 Model generation complete! 🎉');
