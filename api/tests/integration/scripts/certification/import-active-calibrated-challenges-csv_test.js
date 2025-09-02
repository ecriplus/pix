import { knex } from '../../../../db/knex-database-connection.js';
import { ImportActiveCalibratedChallengesCsv } from '../../../../scripts/certification/import-active-calibrated-challenges-csv.js';
import { createTempFile, expect, sinon } from '../../../test-helper.js';

describe('Integration | Scripts | Certification | import-active-calibrated-challenges-csv', function () {
  it('should parse input file', async function () {
    const script = new ImportActiveCalibratedChallengesCsv();
    const options = script.metaInfo.options;
    const file = 'active-calibrated-chalenges-to-import.csv';
    const data = 'challenge_id;delta;alpha\n123;1;2\n456;4;5\n789;7;8';
    const csvFilePath = await createTempFile(file, data);
    const parsedData = await options.file.coerce(csvFilePath);

    expect(parsedData).to.deep.equals([
      { challenge_id: '123', delta: 1, alpha: 2 },
      { challenge_id: '456', delta: 4, alpha: 5 },
      { challenge_id: '789', delta: 7, alpha: 8 },
    ]);
  });

  it('should insert the active calibrated challenges', async function () {
    const script = new ImportActiveCalibratedChallengesCsv();
    const logger = { info: sinon.spy(), debug: sinon.spy(), error: sinon.spy() };
    const file = [
      { challenge_id: '123', delta: 1, alpha: 2 },
      { challenge_id: '456', delta: 4, alpha: 5 },
      { challenge_id: '789', delta: 7, alpha: 8 },
    ];

    // when
    await script.handle({ logger, options: { file, dryRun: false } });

    // then
    const [{ count: addedChallenges }] = await knex('certification-data-active-calibrated-challenges').count();
    expect(addedChallenges).to.equal(3);
  });
});
