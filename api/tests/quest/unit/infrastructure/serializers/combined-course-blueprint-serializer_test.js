import {
  ADMIN_COMBINED_COURSE_BLUEPRINT_ITEMS,
  AdminCombinedCourseBlueprint,
} from '../../../../../src/quest/domain/models/AdminCombinedCourseBlueprint.js';
import { CombinedCourseBlueprint } from '../../../../../src/quest/domain/models/CombinedCourseBlueprint.js';
import * as combinedCourseBlueprintSerializer from '../../../../../src/quest/infrastructure/serializers/combined-course-blueprint-serializer.js';
import { expect } from '../../../../test-helper.js';

describe('Quest | Unit | Infrastructure | Serializers | combined-course-blueprint', function () {
  it('#serialize', function () {
    // given
    const combinedCourseBlueprint = CombinedCourseBlueprint.buildWithQuest({
      adminCombinedCourseBlueprint: new AdminCombinedCourseBlueprint({
        id: 1,
        name: 'Mon parcours',
        internalName: 'Mon modèle de parcours',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        illustration: '/illustrations/image.svg',
        content: AdminCombinedCourseBlueprint.buildContentItems([
          { moduleShortId: 'mon-module' },
          { targetProfileId: 123 },
        ]),
        attestationKey: 'PARENTHOOD',
        organizationIds: [],
      }),
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
                type: ADMIN_COMBINED_COURSE_BLUEPRINT_ITEMS.MODULE,
                value: 'mon-module',
              },
              {
                type: ADMIN_COMBINED_COURSE_BLUEPRINT_ITEMS.EVALUATION,
                value: 123,
              },
            ],
            'created-at': combinedCourseBlueprint.createdAt,
            'updated-at': combinedCourseBlueprint.updatedAt,
            'attestation-key': 'PARENTHOOD',
          },
          type: 'combined-course-blueprints',
          id: '1',
        },
      ],
    });
  });

  it('#deserialize', async function () {
    const date = new Date();
    // given
    const serializedBlueprint = {
      data: {
        attributes: {
          name: 'Mon parcours',
          'internal-name': 'Mon modèle de parcours',
          illustration: '/illustrations/image.svg',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          'attestation-key': 'SIXTH_GRADE',
          content: [
            {
              type: 'passages',
              value: 'mon-module',
            },
            {
              type: 'campaignParticipations',
              value: 123,
            },
          ],
          'created-at': date,
          'updated-at': date,
        },
        type: 'combined-course-blueprints',
        id: '1',
      },
    };

    // when
    const deserialize = await combinedCourseBlueprintSerializer.deserialize(serializedBlueprint);

    // then
    expect(deserialize).deep.equal({
      id: '1',
      name: 'Mon parcours',
      internalName: 'Mon modèle de parcours',
      illustration: '/illustrations/image.svg',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      content: [
        {
          type: 'passages',
          value: 'mon-module',
        },
        {
          type: 'campaignParticipations',
          value: 123,
        },
      ],
      attestationKey: 'SIXTH_GRADE',
      organizationIds: [],
      createdAt: date,
      updatedAt: date,
    });
  });
});
