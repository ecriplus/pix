import { CombinedCourseBlueprint } from '../../../../../src/quest/domain/models/CombinedCourseBlueprint.js';
import { usecases } from '../../../../../src/quest/domain/usecases/index.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, expect, sinon } from '../../../../test-helper.js';

describe('Integration | Quest | Domain | UseCases | get-combined-course-blueprint-by-id', function () {
  let clock;
  const now = new Date('2022-11-28T12:00:00Z');

  beforeEach(async function () {
    clock = sinon.useFakeTimers({ now });
  });

  afterEach(function () {
    clock.restore();
  });

  it('should return a combined course blueprint for a given id', async function () {
    //given
    await databaseBuilder.factory.buildCombinedCourseBlueprint({ id: 1, content: [] });

    await databaseBuilder.commit();

    //when
    const result = await usecases.getCombinedCourseBlueprintById({ id: 1 });

    //then
    expect(result).to.be.instanceOf(CombinedCourseBlueprint);
    expect(result).deep.equal({
      id: 1,
      name: 'Mon parcours combiné',
      internalName: 'Mon schéma de parcours combiné',
      description: 'Le but de ma quête',
      illustration: 'images/illustration.svg',
      createdAt: now,
      updatedAt: now,
      content: [],
    });
  });

  it('should throw when no combined course blueprint is found for a given id', async function () {
    //when
    const error = await catchErr(usecases.getCombinedCourseBlueprintById)({ id: 1 });

    expect(error).to.be.instanceof(NotFoundError);
    expect(error.message).to.equal('Combined course blueprint not found');
  });
});
