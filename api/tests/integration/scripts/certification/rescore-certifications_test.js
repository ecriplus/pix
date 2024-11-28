import { RescoreCertificationScript } from '../../../../scripts/certification/rescore-certifications.js';
import { createTempFile, expect, knex, sinon } from '../../../test-helper.js';

describe('Integration | Scripts | Certification | rescore-certfication', function () {
  it('should parse input file', async function () {
    const script = new RescoreCertificationScript();
    const { options } = script.metaInfo;
    const file = 'certification-courses-ids-to-rescore.csv';
    const data = 'certificationCourseId\n1\n2\n3\n';
    const csvFilePath = await createTempFile(file, data);

    const parsedData = await options.file.coerce(csvFilePath);

    expect(parsedData).to.deep.equals([
      { certificationCourseId: 1 },
      { certificationCourseId: 2 },
      { certificationCourseId: 3 },
    ]);
  });

  it('should save pg boss jobs for each certification course ids', async function () {
    // given
    const file = [{ certificationCourseId: 1 }, { certificationCourseId: 2 }];
    const logger = { info: sinon.spy(), error: sinon.spy() };
    const script = new RescoreCertificationScript();

    // when
    await script.handle({ logger, options: { file } });

    // then
    const [job1, job2] = await knex('pgboss.job')
      .where({ name: 'CertificationRescoringByScriptJob' })
      .orderBy('createdon', 'asc');

    expect([job1.data, job2.data]).to.have.deep.members([
      {
        certificationCourseId: 1,
      },
      {
        certificationCourseId: 2,
      },
    ]);
  });
});
