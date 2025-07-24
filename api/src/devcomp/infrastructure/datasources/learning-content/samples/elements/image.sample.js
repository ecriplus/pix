import { randomUUID } from 'node:crypto';

export function getImageSample() {
  return {
    id: randomUUID(),
    type: 'image',
    url: 'https://assets.pix.org/modulix/placeholder-image.svg',
    alt: '',
    alternativeText: '',
  };
}
