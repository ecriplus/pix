import { fileURLToPath } from 'node:url';

import moduleDatasource from '../../src/devcomp/infrastructure/datasources/learning-content/module-datasource.js';
import { getCsvContent } from '../../src/shared/infrastructure/utils/csv/write-csv-utils.js';

export async function getElementsListAsCsv(modules) {
  const elements = getElements(modules);

  return await getCsvContent({
    data: elements,
    delimiter: '\t',
    fileHeaders: [
      { label: 'ElementModule', value: 'moduleId' },
      { label: 'ElementGrainId', value: 'grainId' },
      { label: 'ElementId', value: 'id' },
      { label: 'ElementType', value: 'type' },
      { label: 'ElementGrainTitle', value: 'grainTitle' },
      { label: 'ElementGrainPosition', value: (row) => row.grainPosition + 1 },
      { label: 'ActivityElementPosition', value: (row) => row.elementPosition + 1 },
      { label: 'ElementInstruction', value: 'instruction' },
    ],
  });
}

// Only run the following if the file is called directly
if (import.meta.url.startsWith('file:')) {
  const modulePath = fileURLToPath(import.meta.url);

  if (process.argv[1] === modulePath) {
    const modules = await moduleDatasource.list();
    console.log(await getElementsListAsCsv(modules));
  }
}

export function getElements(modules) {
  const ELEMENT_TYPES = [
    'download',
    'embed',
    'expand',
    'flashcards',
    'image',
    'qab',
    'qcm',
    'qcu',
    'qcu-declarative',
    'qrocm',
    'separator',
    'text',
    'video',
    'custom',
  ];

  const elements = [];
  for (const module of modules) {
    let elementPosition = 0;

    for (const grain of module.grains) {
      for (const component of grain.components) {
        if (component.type === 'element') {
          if (!ELEMENT_TYPES.includes(component.element.type)) {
            console.warn(`Ignored element ${component.element.id} with unknown type "${component.element.type}".`);
            continue;
          }

          elements.push({
            ...component.element,
            moduleId: module.id,
            elementPosition: elementPosition++,
            grainPosition: module.grains.indexOf(grain),
            grainId: grain.id,
            grainTitle: grain.title,
          });
        }

        if (component.type === 'stepper') {
          for (const step of component.steps) {
            for (const element of step.elements) {
              if (!ELEMENT_TYPES.includes(element.type)) {
                continue;
              }

              elements.push({
                ...element,
                moduleId: module.id,
                elementPosition: elementPosition++,
                grainPosition: module.grains.indexOf(grain),
                grainId: grain.id,
                grainTitle: grain.title,
              });
            }
          }
        }
      }
    }
  }

  return elements;
}
