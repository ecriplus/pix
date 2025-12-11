import {
  COMBINED_COURSE_BLUEPRINT_ITEMS,
  CombinedCourseBlueprint,
} from '../../../../../src/quest/domain/models/CombinedCourseBlueprint.js';
import { expect } from '../../../../test-helper.js';

describe('Quest | Unit | Domain | Models | CombinedCourseBlueprint ', function () {
  describe('#constructor', function () {
    it('should construct object', function () {
      // given
      const values = {
        id: 1,
        name: 'name',
        internalName: 'internaleName',
        description: 'description',
        illustration: 'illustration',
        content: CombinedCourseBlueprint.buildContentItems([{ moduleId: '123' }]),
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-26'),
      };
      // when
      const blueprint = new CombinedCourseBlueprint(values);

      // then
      expect(blueprint).deep.equal(values);
    });
  });
  describe('#buildContentItems', function () {
    it('should build blueprint content items for targetProfileId and moduleId', function () {
      const requirements = CombinedCourseBlueprint.buildContentItems([
        { targetProfileId: 123 },
        { moduleId: 'az-123' },
      ]);

      expect(requirements).deep.equal([
        {
          type: COMBINED_COURSE_BLUEPRINT_ITEMS.EVALUATION,
          value: 123,
        },
        {
          type: COMBINED_COURSE_BLUEPRINT_ITEMS.MODULE,
          value: 'az-123',
        },
      ]);
    });
  });
});
