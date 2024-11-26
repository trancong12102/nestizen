import { writeFile } from 'node:fs/promises';
import { generatorHandler } from '@prisma/generator-helper';

const SCHEMA_INFO_FILE = 'nestizen-schema.json';

generatorHandler({
  onManifest() {
    return {
      prettyName: 'Nestizen Prisma Generator',
      defaultOutput: '.',
    };
  },
  async onGenerate(options) {
    const {
      dmmf,
      generator: { sourceFilePath },
    } = options;

    await writeFile(
      SCHEMA_INFO_FILE,
      JSON.stringify({
        dmmf,
        sourceFilePath,
      }),
    );
  },
});
