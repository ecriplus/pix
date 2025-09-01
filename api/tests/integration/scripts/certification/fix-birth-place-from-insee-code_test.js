import { knex } from '../../../../db/knex-database-connection.js';
import { FixBirthPlaceFromInseeCode } from '../../../../scripts/certification/fix-birth-place-from-insee-code.js';
import { databaseBuilder, expect, sinon } from '../../../test-helper.js';

describe('Integration | Scripts | Certification | fix-birth-place-from-insee-code', function () {
  it('should update all candidates with birthCityCode but without birthcity but with birtCityCode', async function () {
    const excludedINSEECode = '99999';
    const nonExistingINSEECode = '75000';

    // given
    const options = {
      dryRun: false,
      batchSize: 10,
      delayBetweenBatch: 10,
    };
    const logger = {
      info: sinon.stub(),
      debug: sinon.stub(),
      warn: sinon.stub(),
    };

    databaseBuilder.factory.buildCertificationCandidate({ birthCity: 'Paris' });
    const candidateId = databaseBuilder.factory.buildCertificationCandidate({
      birthCity: null,
      birthINSEECode: '75115',
    }).id;
    databaseBuilder.factory.buildCertificationCandidate({
      birthCity: null,
      birthINSEECode: null,
    });
    databaseBuilder.factory.buildCertificationCandidate({
      birthCity: null,
      birthINSEECode: nonExistingINSEECode,
    });
    databaseBuilder.factory.buildCertificationCandidate({
      birthCity: null,
      birthINSEECode: excludedINSEECode,
    });
    databaseBuilder.factory.buildCertificationCpfCountry({
      code: '99100',
      commonName: 'FRANCE',
      originalName: 'FRANCE',
    });
    databaseBuilder.factory.buildCertificationCpfCity({
      name: 'PARIS 15',
      postalCode: '75015',
      INSEECode: '75115',
    });

    await databaseBuilder.commit();

    // when
    const fixBirthPlaceFromInseeCode = new FixBirthPlaceFromInseeCode();
    await fixBirthPlaceFromInseeCode.handle({ options, logger });

    // then
    const updatedCandidate = await knex('certification-candidates').where({ id: candidateId }).first();
    expect(updatedCandidate.birthCity).to.equal('PARIS 15');
    const candidatesWithoutBirthCity = await knex('certification-candidates')
      .where('birthCity', '=', null)
      .where('birthINSEECode', '<>', excludedINSEECode);
    expect(candidatesWithoutBirthCity).to.be.empty;
  });
});
