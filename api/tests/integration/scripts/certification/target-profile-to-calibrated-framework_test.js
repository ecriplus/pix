import { TargetProfileToCalibratedFrameworkScript } from '../../../../scripts/certification/target-profile-to-calibrated-framework.js';
import { catchErr, databaseBuilder, expect, knex, mockLearningContent, sinon } from '../../../test-helper.js';

describe('Integration | Scripts | Certification | target-profile-to-calibrated-framework', function () {
  let logger, script;

  beforeEach(function () {
    logger = { info: sinon.stub(), error: sinon.stub() };
    script = new TargetProfileToCalibratedFrameworkScript();
  });

  it('should create a calibrated framework from given complementary certification key and target profile id', async function () {
    // given
    const learningContent = {
      tubes: [{ id: 'tube1', skillIds: ['skill1'] }],
      skills: [{ id: 'skill1', status: 'actif', tubeId: 'tube1' }],
      challenges: [{ id: 'challenge1', skillId: 'skill1', locales: ['fr'] }],
    };
    await mockLearningContent(learningContent);

    const { id: targetProfileId } = databaseBuilder.factory.buildTargetProfile();
    databaseBuilder.factory.buildTargetProfileTube({ targetProfileId, tubeId: learningContent.tubes[0].id });
    const complementaryCertification = databaseBuilder.factory.buildComplementaryCertification();

    await databaseBuilder.commit();

    // when
    await script.handle({
      options: { complementaryCertificationKey: complementaryCertification.key, targetProfileId },
      logger,
    });

    // then
    const frameworksChallenges = await knex('certification-frameworks-challenges');
    expect(frameworksChallenges).to.have.length(1);
    expect(frameworksChallenges[0].challengeId).to.equal(learningContent.challenges[0].id);
    expect(frameworksChallenges[0].complementaryCertificationKey).to.equal(complementaryCertification.key);
    expect(frameworksChallenges[0].createdAt).to.be.instanceOf(Date);
    expect(frameworksChallenges[0].alpha).to.be.null;
    expect(frameworksChallenges[0].delta).to.be.null;
  });

  context('when the certification key option does not exist in the domain', function () {
    it('should throw an error', async function () {
      // given
      const unknownComplementaryKey = 'unknown';

      // when
      const error = await catchErr(script.handle)({
        options: { complementaryCertificationKey: unknownComplementaryKey, targetProfileId: 1 },
        logger,
      });

      // then
      expect(error).to.be.instanceOf(Error);
      expect(error.message).to.equal('The certification key is missing');
    });
  });

  context('when there are no tubeIds retrieved', function () {
    it('should throw an error', async function () {
      // given
      const learningContent = { tubes: [] };
      await mockLearningContent(learningContent);

      const { id: targetProfileId } = databaseBuilder.factory.buildTargetProfile();
      const complementaryCertification = databaseBuilder.factory.buildComplementaryCertification();

      await databaseBuilder.commit();

      // when
      const error = await catchErr(script.handle)({
        options: { complementaryCertificationKey: complementaryCertification.key, targetProfileId },
        logger,
      });

      // then
      expect(error).to.be.instanceOf(RangeError);
      expect(error.message).to.equal('This target profile does not hold any tubes');
    });
  });
});
