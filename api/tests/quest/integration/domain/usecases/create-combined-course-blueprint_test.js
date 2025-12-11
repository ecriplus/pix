import { CombinedCourseBlueprint } from '../../../../../src/quest/domain/models/CombinedCourseBlueprint.js';
import { usecases } from '../../../../../src/quest/domain/usecases/index.js';
import { expect, knex } from '../../../../test-helper.js';

describe('Integration | Combined course | Domain | UseCases | create-combined-course-blueprint', function () {
  it('should create a combined course blueprint', async function () {
    // given
    const combinedCourseBlueprint = {
      name: 'Mon épure',
      internalName: 'Une épure pour tel niveau',
      illustration: 'illustrations/mon-epure.png',
      description: 'Description',
      content: CombinedCourseBlueprint.buildContentItems([{ moduleId: 'abc-123' }, { targetProfileId: 123 }]),
    };

    await usecases.createCombinedCourseBlueprint({ combinedCourseBlueprint });

    const result = await knex('combined_course_blueprints');
    expect(result).lengthOf(1);
    expect(result[0].name).to.equal(combinedCourseBlueprint.name);
    expect(result[0].internalName).to.equal(combinedCourseBlueprint.internalName);
    expect(result[0].illustration).to.equal(combinedCourseBlueprint.illustration);
    expect(result[0].description).to.equal(combinedCourseBlueprint.description);
    expect(result[0].content).to.deep.equal(combinedCourseBlueprint.content);
    expect(result[0].updatedAt).to.be.instanceOf(Date);
    expect(result[0].createdAt).to.be.instanceOf(Date);
  });
});
