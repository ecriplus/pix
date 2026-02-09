import { CandidateData } from '../../../../../../src/certification/enrolment/infrastructure/candidates-import/CandidateData.js';
import { expect } from '../../../../../test-helper.js';

describe.only('Unit | infrastructure | candidates-import | CandidateData', function () {
  describe('CandidateData constructor', function () {
    let i18n;

    beforeEach(function () {
      i18n = {
        __: () => {
          return 'YES';
        },
      };
    });

    describe('.cleaNumerique', function () {
      it(`returns 'YES' when complementaryCertification key is CLEA`, function () {
        const complementaryCertification = { key: 'CLEA' };
        const candidateData = new CandidateData({ i18n, complementaryCertification });
        expect(candidateData.cleaNumerique).to.be.equal('YES');
      });
      it('returns empty string if complementaryCertification key is NOT CLEA', function () {
        const complementaryCertification = { key: 'DROIT' };
        const candidateData = new CandidateData({ i18n, complementaryCertification });
        expect(candidateData.cleaNumerique).to.be.equal('');
      });
    });

    describe('.pixPlusDroit', function () {
      it(`returns 'YES' when complementaryCertification key is DROIT`, function () {
        const complementaryCertification = { key: 'DROIT' };
        const candidateData = new CandidateData({ i18n, complementaryCertification });
        expect(candidateData.pixPlusDroit).to.be.equal('YES');
      });
      it('returns empty string if complementaryCertification key is NOT DROIT', function () {
        const complementaryCertification = { key: 'CLEA' };
        const candidateData = new CandidateData({ i18n, complementaryCertification });
        expect(candidateData.pixPlusDroit).to.be.equal('');
      });
    });

    describe('.pixPlusEdu1erDegre', function () {
      it(`returns 'YES' when complementaryCertification key is EDU_1ER_DEGRE`, function () {
        const complementaryCertification = { key: 'EDU_1ER_DEGRE' };
        const candidateData = new CandidateData({ i18n, complementaryCertification });
        expect(candidateData.pixPlusEdu1erDegre).to.be.equal('YES');
      });
      it('returns empty string if complementaryCertification key is NOT EDU_1ER_DEGRE', function () {
        const complementaryCertification = { key: 'DROIT' };
        const candidateData = new CandidateData({ i18n, complementaryCertification });
        expect(candidateData.pixPlusEdu1erDegre).to.be.equal('');
      });
    });

    describe('.pixPlusEdu2ndDegre', function () {
      it(`returns 'YES' when complementaryCertification key is EDU_2ND_DEGRE`, function () {
        const complementaryCertification = { key: 'EDU_2ND_DEGRE' };
        const candidateData = new CandidateData({ i18n, complementaryCertification });
        expect(candidateData.pixPlusEdu2ndDegre).to.be.equal('YES');
      });
      it('returns empty string if complementaryCertification key is NOT EDU_2ND_DEGRE', function () {
        const complementaryCertification = { key: 'DROIT' };
        const candidateData = new CandidateData({ i18n, complementaryCertification });
        expect(candidateData.pixPlusEdu2ndDegre).to.be.equal('');
      });
    });

    describe('.pixPlusEduCPE', function () {
      it(`returns 'YES' when complementaryCertification key is EDU_CPE`, function () {
        const complementaryCertification = { key: 'EDU_CPE' };
        const candidateData = new CandidateData({ i18n, complementaryCertification });
        expect(candidateData.pixPlusEduCPE).to.be.equal('YES');
      });
      it('returns empty string if complementaryCertification key is NOT EDU_CPE', function () {
        const complementaryCertification = { key: 'DROIT' };
        const candidateData = new CandidateData({ i18n, complementaryCertification });
        expect(candidateData.pixPlusEduCPE).to.be.equal('');
      });
    });

    describe('.pixPlusProSante', function () {
      it(`returns 'YES' when complementaryCertification key is PRO_SANTE`, function () {
        const complementaryCertification = { key: 'PRO_SANTE' };
        const candidateData = new CandidateData({ i18n, complementaryCertification });
        expect(candidateData.pixPlusProSante).to.be.equal('YES');
      });
      it('returns empty string if complementaryCertification key is NOT PRO_SANTE', function () {
        const complementaryCertification = { key: 'DROIT' };
        const candidateData = new CandidateData({ i18n, complementaryCertification });
        expect(candidateData.pixPlusProSante).to.be.equal('');
      });
    });

    describe('use empty string instead of null value', function () {
      it('replace null by empty string for id attribute', function () {
        const candidateData = new CandidateData({ i18n, id: null });
        expect(candidateData.id).to.equal('');
      });
    });

    describe('birthCity', function () {
      it('set empty birthCity if birthCountry is france and birthINSEECode', function () {
        const birthINSEECode = '75115';
        const birthCountry = 'FRANCE';
        const birthCity = 'Paris';
        const candidateData = new CandidateData({ i18n, birthCountry, birthINSEECode, birthCity });
        expect(candidateData.birthCity).to.equal('');
      });

      it('set birthCity if birthCountry is france and there is no birthINSEECode', function () {
        const birthINSEECode = undefined;
        const birthCountry = 'FRANCE';
        const birthCity = 'Paris';
        const candidateData = new CandidateData({ i18n, birthCountry, birthINSEECode, birthCity });
        expect(candidateData.birthCity).to.equal('Paris');
      });

      it('set birthCity if birthCountry is not france', function () {
        const birthINSEECode = undefined;
        const birthCountry = 'SPAIN';
        const birthCity = 'Madrid';
        const candidateData = new CandidateData({ i18n, birthCountry, birthINSEECode, birthCity });
        expect(candidateData.birthCity).to.equal('Madrid');
      });
    });

    describe('birthINSEECode', function () {
      it('set to 99 if birthINSEECode is not france and INSEE CODE not equal to 99100', function () {
        const birthINSEECode = '99127';
        const birthCountry = 'ITALY';
        const candidateData = new CandidateData({ i18n, birthINSEECode, birthCountry });
        expect(candidateData.birthINSEECode).to.equal('99');
      });

      it('set to given birthINSEECode if birthCountry is france', function () {
        const birthINSEECode = '75115';
        const birthCountry = 'FRANCE';
        const candidateData = new CandidateData({ i18n, birthCountry, birthINSEECode });
        expect(candidateData.birthINSEECode).to.equal('75115');
      });
    });

    describe('extraTimePercentage', function () {
      it('set to empty string if not a number given', function () {
        const extraTimePercentage = 'string';
        const candidateData = new CandidateData({ i18n, extraTimePercentage });
        expect(candidateData.extraTimePercentage).to.equal('');
      });

      it('set to empty string if number given is negative', function () {
        const extraTimePercentage = -13;
        const candidateData = new CandidateData({ i18n, extraTimePercentage });
        expect(candidateData.extraTimePercentage).to.equal('');
      });

      it('set to value if number given is positive', function () {
        const extraTimePercentage = 25;
        const candidateData = new CandidateData({ i18n, extraTimePercentage });
        expect(candidateData.extraTimePercentage).to.equal(25);
      });
    });
  });
});
