import { Quest } from '../../../../../src/quest/domain/models/Quest.js';
import * as combinedCourseDetailsSerializer from '../../../../../src/quest/infrastructure/serializers/combined-course-details-serializer.js';
import { domainBuilder, expect } from '../../../../test-helper.js';

describe('Quest | Unit | Infrastructure | Serializers | combined-course-details', function () {
  it('#serialize', function () {
    // given
    const combinedCourseDetails = domainBuilder.buildCombinedCourseDetails({
      name: 'Mon parcours',
      code: 'COMBINIX1',
      quest: new Quest({
        id: 1,
        rewardId: null,
        rewardType: null,
        eligibilityRequirements: [],
        successRequirements: [
          {
            requirement_type: 'campaignParticipations',
            comparison: 'all',
            data: {
              campaignId: {
                data: 1,
                comparison: 'equal',
              },
            },
          },
        ],
      }),
    });

    // when
    const serializedCombinedCourseDetails = combinedCourseDetailsSerializer.serialize(combinedCourseDetails);

    // then
    expect(serializedCombinedCourseDetails).to.deep.equal({
      data: {
        attributes: {
          name: 'Mon parcours',
          code: 'COMBINIX1',
          'campaign-ids': [1],
        },
        relationships: {
          'combined-course-participations': {
            links: {
              related: '/api/combined-courses/1/participations',
            },
          },
          'combined-course-statistics': {
            links: {
              related: '/api/combined-courses/1/statistics',
            },
          },
        },
        type: 'combined-courses',
        id: '1',
      },
    });
  });
});
