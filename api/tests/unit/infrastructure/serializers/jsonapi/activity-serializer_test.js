import { Activity } from '../../../../../src/school/domain/models/Activity.js';
import * as serializer from '../../../../../src/school/infrastructure/serializers/activity-serializer.js';
import { domainBuilder, expect } from '../../../../test-helper.js';

describe('Unit | Serializer | JSONAPI | activity-serializer', function () {
  describe('#serialize', function () {
    it('should convert an Activity model object into JSON API data', function () {
      const assessmentId = 1232345;
      const level = Activity.levels.TUTORIAL;

      const activity = domainBuilder.buildActivity({
        level: level,
        assessmentId,
      });

      const expectedJSON = {
        data: {
          type: 'activities',
          id: activity.id.toString(),
          attributes: {
            level: level,
            'assessment-id': assessmentId,
          },
        },
      };

      // when
      const json = serializer.serialize(activity);

      // then
      expect(json).to.deep.equal(expectedJSON);
    });
  });
});
