import {
  COMBINED_COURSE_BLUEPRINT_ITEMS,
  CombinedCourseBlueprint,
} from '../../../../../src/quest/domain/models/CombinedCourseBlueprint.js';
import * as combinedCourseBlueprintSerializer from '../../../../../src/quest/infrastructure/serializers/combined-course-blueprint-serializer.js';
import { domainBuilder, expect } from '../../../../test-helper.js';

describe('Quest | Unit | Infrastructure | Serializers | combined-course-blueprint', function () {
  it('#serialize', function () {
    // given
    const combinedCourseBlueprint = domainBuilder.buildCombinedCourseBlueprint({
      content: CombinedCourseBlueprint.buildContentItems([{ moduleId: 'mon-module' }, { targetProfileId: 123 }]),
    });

    // when
    const serializedCombinedCourseBlueprints = combinedCourseBlueprintSerializer.serialize([combinedCourseBlueprint]);

    // then
    expect(serializedCombinedCourseBlueprints).to.deep.equal({
      data: [
        {
          attributes: {
            name: 'Mon parcours',
            'internal-name': 'Mon modèle de parcours',
            illustration: '/illustrations/image.svg',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            content: [
              {
                type: COMBINED_COURSE_BLUEPRINT_ITEMS.MODULE,
                value: 'mon-module',
              },
              {
                type: COMBINED_COURSE_BLUEPRINT_ITEMS.EVALUTION,
                value: 123,
              },
            ],
            'created-at': combinedCourseBlueprint.createdAt,
            'updated-at': combinedCourseBlueprint.updatedAt,
          },
          type: 'combined-course-blueprints',
          id: '1',
        },
      ],
    });
  });
});
