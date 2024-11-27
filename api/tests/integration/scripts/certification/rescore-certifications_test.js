import { main } from '../../../../scripts/certification/rescore-certifications.js';
import { createTempFile, expect, knex } from '../../../test-helper.js';

describe('Integration | Scripts | Certification | rescore-certfication', function () {
  it('should save pg boss jobs for each certification course ids', async function () {
    // given
    const file = 'certification-courses-ids-to-rescore.csv';
    const data = '1\n2\n';
    const csvFilePath = await createTempFile(file, data);

    // when
    await main(csvFilePath);

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
