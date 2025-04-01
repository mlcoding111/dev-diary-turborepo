#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import Mustache from 'mustache';

// 🛠️ Configuration: Define where each type should be generated
const CONFIG = {
  outputDirs: {
    models: path.join(__dirname, '../src/models'), // Services, Controllers, etc.
    entities: path.join(__dirname, '../src/entities'), // Entities stored separately
  },
};

// 🚀 Convert "my_model" → "MyModel"
const toPascalCase = (str: string) =>
  str
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
// Convert "my_model_multiple" → "my-model-multiple"
const toKebabCase = (str: string) =>
  str
    .split('_')
    .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join('');

// 🛠️ CLI Arguments
const args = process.argv.slice(2);
if (args[0] === 'model' && args[1]) {
  const modelName = args[1];
  const className = toPascalCase(modelName);
  const modelDir = path.join(CONFIG.outputDirs.models, modelName);
  const entityDir = CONFIG.outputDirs.entities; // Separate entity directory

  // Ensure directories exist
  if (!fs.existsSync(modelDir)) fs.mkdirSync(modelDir, { recursive: true });
  if (!fs.existsSync(entityDir)) fs.mkdirSync(entityDir, { recursive: true });

  // 🎯 Files to Generate (with custom paths)
  const files = [
    { name: 'service.ts', outputDir: modelDir },
    // { name: 'controller.ts', outputDir: modelDir },
    // { name: 'subscriber.ts', outputDir: modelDir },
    // { name: 'repository.ts', outputDir: modelDir },
    // { name: 'listener.ts', outputDir: modelDir },
    { name: 'entity.ts', outputDir: entityDir }, // Entity goes to src/entities
  ];

  files.forEach(({ name, outputDir }) => {
    const templatePath = path.join(__dirname, `../templates/${name}.mustache`);
    const outputPath = path.join(
      outputDir,
      `${toKebabCase(modelName)}.${name}`,
    );

    if (fs.existsSync(templatePath)) {
      const template = fs.readFileSync(templatePath, 'utf-8');
      const content = Mustache.render(template, { modelName, className });
      fs.writeFileSync(outputPath, content);
      console.log(`✅ Generated: ${outputPath}`);
    }
  });

  console.log('\n🚀 Model generation complete! 🎉');
} else {
  console.log('Usage: pnpm run generate model <model_name>');
}
