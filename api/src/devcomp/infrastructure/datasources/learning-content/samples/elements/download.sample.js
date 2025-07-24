import { randomUUID } from 'node:crypto';

export function getDownloadSample() {
  return {
    id: randomUUID(),
    type: 'download',
    files: [
      {
        url: 'https://assets.pix.org/modulix/placeholder-image.svg',
        format: '.svg',
      },
    ],
  };
}
