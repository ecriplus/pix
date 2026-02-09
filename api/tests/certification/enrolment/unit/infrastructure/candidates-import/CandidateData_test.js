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
  });
});
