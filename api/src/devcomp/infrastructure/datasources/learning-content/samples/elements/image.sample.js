import { randomUUID } from 'node:crypto';

export function getImageSample() {
  return {
    id: randomUUID(),
    type: 'image',
    url: 'https://assets.pix.org/modules/placeholder-image.svg',
    alt: '',
    alternativeText: '',
  };
}
