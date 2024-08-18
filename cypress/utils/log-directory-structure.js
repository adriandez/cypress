import fsPromises from 'fs/promises';
import fs from 'fs';
import path from 'path';

export const logDirectoryStructure = async (
  dir,
  logFile,
  recursive = false
) => {
  const walk = async (dir, indent = '') => {
    const files = await fsPromises.readdir(dir, { withFileTypes: true });
    for (const file of files) {
      const logMessage = `${indent}${file.name}${file.isDirectory() ? '/' : ''}`;
      fs.appendFileSync(logFile, `${logMessage}\n`);
      if (recursive && file.isDirectory()) {
        await walk(path.resolve(dir, file.name), indent + '  ');
      }
    }
  };

  // Log directory structure with a header
  fs.appendFileSync(logFile, `\nDirectory structure of: ${dir}\n`);
  await walk(dir);
};
