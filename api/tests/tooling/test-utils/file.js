import fs from 'node:fs/promises';

export async function isSameBinary(referencePath, buffer) {
  const expectedBuffer = await fs.readFile(referencePath);
  return expectedBuffer.equals(buffer);
}
