import { readdir } from 'node:fs/promises';

export async function countFilesInPath(path) {
  let fileNumber = 0;
  const files = await readdir(path, { recursive: true, withFileTypes: true });

  for (const file of files) {
    if (file.isFile()) {
      fileNumber++;
    }
  }
  return fileNumber;
}

export class BoundedContextDirectory {
  constructor({ name, fileCount }) {
    this.name = name;
    this.fileCount = fileCount;
  }

  toString() {
    return `${this.name}: ${this.fileCount}`;
  }
}
