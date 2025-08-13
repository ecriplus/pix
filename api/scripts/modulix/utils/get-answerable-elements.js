export function getAnswerableElements(modules) {
  const ANSWERABLE_ELEMENT_TYPES = ['qcm', 'qcu', 'qcu-declarative', 'qcu-discovery', 'qrocm'];

  const elements = [];
  for (const module of modules) {
    let grainPosition = -1;
    let activityElementPosition = 0;

    for (const section of module.sections) {
      for (const grain of section.grains) {
        grainPosition++;

        for (const component of grain.components) {
          if (component.type === 'element') {
            if (!ANSWERABLE_ELEMENT_TYPES.includes(component.element.type)) {
              continue;
            }

            elements.push({
              ...component.element,
              moduleId: module.id,
              moduleSlug: module.slug,
              activityElementPosition: activityElementPosition++,
              grainPosition: grainPosition,
              grainId: grain.id,
              grainTitle: grain.title,
            });
          }

          if (component.type === 'stepper') {
            for (const step of component.steps) {
              for (const element of step.elements) {
                if (!ANSWERABLE_ELEMENT_TYPES.includes(element.type)) {
                  continue;
                }

                elements.push({
                  ...element,
                  moduleId: module.id,
                  moduleSlug: module.slug,
                  activityElementPosition: activityElementPosition++,
                  grainPosition: grainPosition,
                  grainId: grain.id,
                  grainTitle: grain.title,
                });
              }
            }
          }
        }
      }
    }
  }

  return elements;
}
