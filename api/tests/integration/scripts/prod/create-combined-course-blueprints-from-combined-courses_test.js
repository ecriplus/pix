import { expect } from 'chai';
import sinon from 'sinon';

import { CreateCombinedCourseBlueprint } from '../../../../scripts/prod/create-combined-course-blueprints-from-combined-courses.js';
import { databaseBuilder, knex } from '../../../test-helper.js';

describe('CreateCombinedCourseBlueprint', function () {
  describe('Options', function () {
    it('has the correct options', function () {
      const script = new CreateCombinedCourseBlueprint();
      const { options } = script.metaInfo;

      expect(options.dryRun).to.deep.include({
        type: 'boolean',
        describe: 'dry run mode (changes are not persisted in Db)',
        default: true,
      });
    });
  });

  describe('Handle', function () {
    let script;
    let logger;

    beforeEach(function () {
      script = new CreateCombinedCourseBlueprint();
      logger = { info: sinon.spy(), error: sinon.spy() };
    });

    context('when dryRun is false', function () {
      it('creates combined course blueprints', async function () {
        const targetProfile = databaseBuilder.factory.buildTargetProfile();
        const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });
        databaseBuilder.factory.buildCombinedCourse({
          combinedCourseContents: [{ campaignId: campaign.id }, { moduleId: 'module-id' }],
        });
        await databaseBuilder.commit();

        await script.handle({ options: { dryRun: false }, logger });

        const combinedCourseBlueprints = await knex.select('*').from('combined_course_blueprints');
        expect(combinedCourseBlueprints).to.have.lengthOf(1);
        expect(combinedCourseBlueprints[0].name).to.equal('Mon parcours combiné');
        expect(combinedCourseBlueprints[0].internalName).to.equal('Modèle de Mon parcours combiné');
        expect(combinedCourseBlueprints[0].description).to.equal('Le but de ma quête');
        expect(combinedCourseBlueprints[0].illustration).to.equal('images/illustration.svg');
        expect(combinedCourseBlueprints[0].content).to.deep.equal([
          { type: 'evaluation', value: targetProfile.id },
          { type: 'module', value: 'module-id' },
        ]);
      });

      it('set combinedCourseBlueprint id with the newly created combined course blueprint id', async function () {
        const targetProfile = databaseBuilder.factory.buildTargetProfile();
        const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });
        const combinedCourse = databaseBuilder.factory.buildCombinedCourse({
          combinedCourseContents: [{ campaignId: campaign.id }, { moduleId: 'module-id' }],
        });
        await databaseBuilder.commit();

        await script.handle({ options: { dryRun: false }, logger });

        const combinedCourseBlueprints = await knex.select('*').from('combined_course_blueprints').first();
        const updatedCombinedCourse = await knex
          .select('*')
          .from('combined_courses')
          .where({ id: combinedCourse.id })
          .first();
        expect(updatedCombinedCourse.combinedCourseBlueprintId).to.equal(combinedCourseBlueprints.id);
      });

      it('does not create blueprint if combined course has already a combinedCourseBlueprintId', async function () {
        const combinedCourseBlueprint = databaseBuilder.factory.buildCombinedCourseBlueprint({
          content: { moduleId: 'toto' },
        });
        databaseBuilder.factory.buildCombinedCourse({
          combinedCourseBlueprintId: combinedCourseBlueprint.id,
        });
        await databaseBuilder.commit();

        await script.handle({ options: { dryRun: false }, logger });

        const combinedCourseBlueprints = await knex.select('*').from('combined_course_blueprints');

        expect(combinedCourseBlueprints).lengthOf(1);
      });

      it('does not recreate blueprint with the same content', async function () {
        const targetProfile = databaseBuilder.factory.buildTargetProfile();
        const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });

        databaseBuilder.factory.buildCombinedCourse({
          code: 'AZERTY12',
          combinedCourseContents: [{ campaignId: campaign.id }, { moduleId: 'module-id' }],
        });

        databaseBuilder.factory.buildCombinedCourse({
          code: 'QWERTY12',
          name: 'other Name',
          description: 'but same content',
          combinedCourseContents: [{ campaignId: campaign.id }, { moduleId: 'module-id' }],
        });

        await databaseBuilder.commit();

        await script.handle({ options: { dryRun: false }, logger });

        const combinedCourseBlueprints = await knex.select('*').from('combined_course_blueprints');
        expect(combinedCourseBlueprints).to.have.lengthOf(1);

        const updatedCombinedCourses = await knex('combined_courses').pluck('combinedCourseBlueprintId');

        expect(updatedCombinedCourses[0]).to.equal(combinedCourseBlueprints[0].id);
        expect(updatedCombinedCourses[1]).to.equal(combinedCourseBlueprints[0].id);
      });
    });

    context('when dryRun is true', function () {
      it('should not update combined course nor create combined course blueprint', async function () {
        const targetProfile = databaseBuilder.factory.buildTargetProfile();
        const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });
        const combinedCourseId = databaseBuilder.factory.buildCombinedCourse({
          combinedCourseContents: [{ campaignId: campaign.id }, { moduleId: 'module-id' }],
        }).id;
        await databaseBuilder.commit();

        await script.handle({ options: { dryRun: true }, logger });

        const combinedCourseBlueprints = await knex.select('*').from('combined_course_blueprints');
        const combinedCourse = await knex.select('*').from('combined_courses').where({ id: combinedCourseId });
        expect(combinedCourseBlueprints).to.have.lengthOf(0);
        expect(combinedCourse.combinedCourseBlueprintId).to.be.undefined;
      });
    });
  });
});
