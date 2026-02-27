import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';

import { examples } from '@1024pix/epreuves-components/examples';

const module = {
  id: '235c680e-cbd2-4c56-bef6-80d3ed4d417a',
  shortId: '0aefd71f',
  slug: 'demo-epreuves-components',
  title: 'Démonstration des composants Pix Épreuves',
  isBeta: true,
  visibility: 'private',
  details: {
    image: 'https://assets.pix.org/modules/placeholder-details.svg',
    description:
      '<p>Ce module est dédié à des tests internes à Pix.</p><p>Il contient normalement tous les composants Pix Épreuves.</p>',
    duration: 2,
    level: 'novice',
    objectives: ['<p>Non régression sur les composants Pix Épreuves.</p>'],
    tabletSupport: 'comfortable',
  },
  sections: [
    {
      id: 'be0a544c-99bd-4fbc-99b4-a52b5456a008',
      type: 'blank',
      grains: Object.entries(examples)
        .map(([key, value]) => generateGrain(key, value))
        .sort(byPOIName),
    },
  ],
};

function generateGrain(poiName, props) {
  const grain = {};

  grain.id = randomUUID();
  grain.type = 'discovery';
  grain.title = poiName;
  grain.components = generateComponent(poiName, props);

  return grain;
}

function generateComponent(poiName, props) {
  return [
    {
      type: 'element',
      element: {
        id: randomUUID(),
        type: 'text',
        content: `<p>${poiName}</p>`,
      },
    },
    {
      type: 'element',
      element: {
        id: randomUUID(),
        type: 'custom',
        instruction: '',
        tagName: poiName,
        props: props,
        title: '',
        functionalInstruction: '',
      },
    },
  ];
}

function byPOIName(previousGrain, nextGrain) {
  return previousGrain.title.localeCompare(nextGrain.title);
}

await fs.writeFile(
  'api/src/devcomp/infrastructure/datasources/learning-content/modules/demo-epreuves-components.json',
  JSON.stringify(module, null, 2),
);
