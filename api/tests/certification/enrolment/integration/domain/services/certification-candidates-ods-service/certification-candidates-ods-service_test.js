import fs from 'node:fs';
import * as url from 'node:url';

import * as complementaryCertificationRepository from '../../../../../../../src/certification/complementary-certification/infrastructure/repositories/complementary-certification-repository.js';
import * as certificationCandidatesOdsService from '../../../../../../../src/certification/enrolment/domain/services/certification-candidates-ods-service.js';
import * as centerRepository from '../../../../../../../src/certification/enrolment/infrastructure/repositories/center-repository.js';
import * as certificationCpfCityRepository from '../../../../../../../src/certification/enrolment/infrastructure/repositories/certification-cpf-city-repository.js';
import * as certificationCpfCountryRepository from '../../../../../../../src/certification/enrolment/infrastructure/repositories/certification-cpf-country-repository.js';
import { BILLING_MODES } from '../../../../../../../src/certification/shared/domain/constants.js';
import { CERTIFICATION_CANDIDATES_ERRORS } from '../../../../../../../src/certification/shared/domain/constants/certification-candidates-errors.js';
import { ComplementaryCertificationKeys } from '../../../../../../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';
import * as certificationCpfService from '../../../../../../../src/certification/shared/domain/services/certification-cpf-service.js';
import { CertificationCandidatesError } from '../../../../../../../src/shared/domain/errors.js';
import { getI18n } from '../../../../../../../src/shared/infrastructure/i18n/i18n.js';
import { catchErr, databaseBuilder, domainBuilder, expect, sinon } from '../../../../../../test-helper.js';

const { promises } = fs;

const { readFile } = promises;

const i18n = getI18n();

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

describe('Integration | Services | extractCertificationCandidatesFromCandidatesImportSheet', function () {
  let userId;
  let sessionId, session;
  let mailCheck;
  let candidateList;
  let cleaComplementaryCertification;

  beforeEach(async function () {
    cleaComplementaryCertification = databaseBuilder.factory.buildComplementaryCertification({
      label: 'CléA Numérique',
      key: ComplementaryCertificationKeys.CLEA,
    });
    const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
    userId = databaseBuilder.factory.buildUser().id;
    databaseBuilder.factory.buildCertificationCenterMembership({ userId, certificationCenterId });
    const sessionData = databaseBuilder.factory.buildSession({ certificationCenterId });
    sessionId = sessionData.id;
    session = domainBuilder.certification.enrolment.buildSession(sessionData);

    databaseBuilder.factory.buildCertificationCpfCountry({
      code: '99100',
      commonName: 'FRANCE',
      originalName: 'FRANCE',
      matcher: 'ACEFNR',
    });
    databaseBuilder.factory.buildCertificationCpfCountry({
      code: '99132',
      commonName: 'ANGLETERRE',
      originalName: 'ANGLETERRE',
      matcher: 'AEEEGLNRRT',
    });

    databaseBuilder.factory.buildCertificationCpfCity({ name: 'AJACCIO', INSEECode: '2A004', isActualName: true });
    databaseBuilder.factory.buildCertificationCpfCity({ name: 'PARIS 18', postalCode: '75018', isActualName: true });
    databaseBuilder.factory.buildCertificationCpfCity({
      name: 'SAINT-ANNE',
      postalCode: '97180',
      isActualName: true,
    });

    databaseBuilder.factory.buildCertificationCpfCity({
      name: 'BUELLAS',
      postalCode: '01310',
      INSEECode: '01065',
    });
    await databaseBuilder.commit();

    mailCheck = { checkDomainIsValid: sinon.stub() };

    candidateList = _buildCandidateList({ sessionId });
  });

  it('should throw a CertificationCandidatesError if there is an error in the file', async function () {
    // given
    const odsFilePath = `${__dirname}/attendance_sheet_extract_mandatory_ko_test.ods`;
    const odsBuffer = await readFile(odsFilePath);
    mailCheck.checkDomainIsValid.resolves();

    // when
    const error = await catchErr(
      certificationCandidatesOdsService.extractCertificationCandidatesFromCandidatesImportSheet,
    )({
      i18n,
      session,
      odsBuffer,
      certificationCpfService,
      certificationCpfCountryRepository,
      certificationCpfCityRepository,
      centerRepository,
      complementaryCertificationRepository,
      isSco: true,
      mailCheck,
    });

    // then
    expect(error).to.be.instanceOf(CertificationCandidatesError);
    expect(error.code).to.equal('CANDIDATE_RESULT_RECIPIENT_EMAIL_NOT_VALID');
    expect(error.meta).to.deep.equal({ line: 13, value: 'destinataire@gmail.com, destinataire@gmail.com' });
  });

  it('should throw a CertificationCandidatesError if there is an error in the birth information', async function () {
    // given
    const odsFilePath = `${__dirname}/attendance_sheet_extract_birth_ko_test.ods`;
    const odsBuffer = await readFile(odsFilePath);
    mailCheck.checkDomainIsValid.resolves();

    // when
    const error = await catchErr(
      certificationCandidatesOdsService.extractCertificationCandidatesFromCandidatesImportSheet,
    )({
      i18n,
      session,
      odsBuffer,
      certificationCpfService,
      certificationCpfCountryRepository,
      certificationCpfCityRepository,
      centerRepository,
      complementaryCertificationRepository,
      isSco: true,
      mailCheck,
    });

    // then
    expect(error).to.be.instanceOf(CertificationCandidatesError);
    expect(error.code).to.equal(CERTIFICATION_CANDIDATES_ERRORS.CANDIDATE_FOREIGN_INSEE_CODE_NOT_VALID.code);
  });

  it('should throw a CertificationCandidatesError if there are email errors', async function () {
    // given
    const odsFilePath = `${__dirname}/attendance_sheet_extract_recipient_email_ko_test.ods`;
    const odsBuffer = await readFile(odsFilePath);
    mailCheck.checkDomainIsValid.withArgs('jack@d.it').throws();

    // when
    const error = await catchErr(
      certificationCandidatesOdsService.extractCertificationCandidatesFromCandidatesImportSheet,
    )({
      i18n,
      session,
      odsBuffer,
      certificationCpfService,
      certificationCpfCountryRepository,
      certificationCpfCityRepository,
      centerRepository,
      complementaryCertificationRepository,
      isSco: true,
      mailCheck,
    });

    // then
    const certificationCandidatesError = new CertificationCandidatesError({
      code: CERTIFICATION_CANDIDATES_ERRORS.CANDIDATE_RESULT_RECIPIENT_EMAIL_NOT_VALID.code,
      meta: { email: 'jack@d.it', line: 1 },
    });

    expect(error).to.deepEqualInstance(certificationCandidatesError);
  });

  context('when there is duplicate certification candidate', function () {
    it('should throw a CertificationCandidatesError', async function () {
      // given
      const odsFilePath = `${__dirname}/attendance_sheet_extract_duplicate_candidate_ko_test.ods`;
      const odsBuffer = await readFile(odsFilePath);

      // when
      const error = await catchErr(
        certificationCandidatesOdsService.extractCertificationCandidatesFromCandidatesImportSheet,
      )({
        i18n,
        session,
        odsBuffer,
        certificationCpfService,
        certificationCpfCountryRepository,
        certificationCpfCityRepository,
        centerRepository,
        complementaryCertificationRepository,
        isSco: true,
        mailCheck,
      });

      // then
      const certificationCandidatesError = new CertificationCandidatesError({
        code: CERTIFICATION_CANDIDATES_ERRORS.DUPLICATE_CANDIDATE.code,
        meta: { line: 14 },
      });

      expect(error).to.deepEqualInstance(certificationCandidatesError);
    });
  });

  it('should return extracted and validated certification candidates', async function () {
    // given
    const isSco = true;
    const odsFilePath = `${__dirname}/attendance_sheet_extract_ok_test.ods`;
    const odsBuffer = await readFile(odsFilePath);

    // when
    const actualCandidates =
      await certificationCandidatesOdsService.extractCertificationCandidatesFromCandidatesImportSheet({
        i18n,
        session,
        isSco,
        odsBuffer,
        certificationCpfService,
        certificationCpfCountryRepository,
        certificationCpfCityRepository,
        centerRepository,
        complementaryCertificationRepository,
        mailCheck,
      });

    // then
    candidateList = _buildCandidateList({ sessionId });
    const expectedCandidates = candidateList.map(domainBuilder.certification.enrolment.buildCandidate);
    expect(actualCandidates).to.deep.equal(expectedCandidates);
  });

  context('when certification center has habilitations', function () {
    it('should return extracted and validated certification candidates with complementary certification', async function () {
      // given
      mailCheck.checkDomainIsValid.resolves();

      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter({}).id;
      databaseBuilder.factory.buildComplementaryCertificationHabilitation({
        certificationCenterId,
        complementaryCertificationId: cleaComplementaryCertification.id,
      });

      const userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildCertificationCenterMembership({ userId, certificationCenterId });
      const sessionData = databaseBuilder.factory.buildSession({ certificationCenterId });
      const session = domainBuilder.certification.enrolment.buildSession(sessionData);

      await databaseBuilder.commit();

      const odsFilePath = `${__dirname}/attendance_sheet_extract_with_complementary_certifications_ok_test.ods`;
      const odsBuffer = await readFile(odsFilePath);
      candidateList = _buildCandidateList({
        sessionId: sessionData.id,
        complementaryCertifications: [cleaComplementaryCertification],
      });
      const expectedCandidates = candidateList.map(domainBuilder.certification.enrolment.buildCandidate);

      // when
      const actualCandidates =
        await certificationCandidatesOdsService.extractCertificationCandidatesFromCandidatesImportSheet({
          i18n,
          session,
          odsBuffer,
          certificationCpfService,
          certificationCpfCountryRepository,
          certificationCpfCityRepository,
          centerRepository,
          complementaryCertificationRepository,
          isSco: false,
          mailCheck,
        });

      // then
      expect(actualCandidates).to.deep.equal(expectedCandidates);
    });
  });

  it('should return extracted and validated certification candidates with billing information', async function () {
    // given
    mailCheck.checkDomainIsValid.resolves();
    const isSco = false;

    const odsFilePath = `${__dirname}/attendance_sheet_extract_with_billing_ok_test.ods`;
    const odsBuffer = await readFile(odsFilePath);
    candidateList = _buildCandidateList({ hasBillingMode: true, sessionId });
    const expectedCandidates = candidateList.map(domainBuilder.certification.enrolment.buildCandidate);

    // when
    const actualCandidates =
      await certificationCandidatesOdsService.extractCertificationCandidatesFromCandidatesImportSheet({
        i18n,
        session,
        isSco,
        odsBuffer,
        certificationCpfService,
        certificationCpfCountryRepository,
        certificationCpfCityRepository,
        centerRepository,
        complementaryCertificationRepository,
        mailCheck,
      });

    // then
    expect(actualCandidates).to.deep.equal(expectedCandidates);
  });

  it('should return extracted and validated certification candidates without billing information when certification center is AEFE', async function () {
    // given
    const isSco = true;
    const odsFilePath = `${__dirname}/attendance_sheet_extract_ok_test.ods`;
    const odsBuffer = await readFile(odsFilePath);
    mailCheck.checkDomainIsValid.resolves();

    // when
    const actualCandidates =
      await certificationCandidatesOdsService.extractCertificationCandidatesFromCandidatesImportSheet({
        i18n,
        session,
        isSco,
        odsBuffer,
        certificationCpfService,
        certificationCpfCountryRepository,
        certificationCpfCityRepository,
        centerRepository,
        complementaryCertificationRepository,
        mailCheck,
      });

    // then
    const expectedCandidates = candidateList.map(domainBuilder.certification.enrolment.buildCandidate);
    expect(actualCandidates).to.deep.equal(expectedCandidates);
  });
});

function _buildCandidateList({ hasBillingMode = false, sessionId, complementaryCertifications = [] }) {
  const firstCandidate = {
    id: null,
    sessionId,
    createdAt: null,
    lastName: 'Gallagher',
    firstName: 'Jack',
    birthdate: '1980-08-10',
    sex: 'M',
    birthCity: 'Londres',
    birthCountry: 'ANGLETERRE',
    birthINSEECode: '99132',
    birthPostalCode: null,
    birthProvinceCode: null,
    resultRecipientEmail: 'destinataire@gmail.com',
    email: 'jack@d.it',
    externalId: null,
    extraTimePercentage: 0.15,
    billingMode: hasBillingMode ? BILLING_MODES.PAID : null,
    prepaymentCode: null,
    subscriptions: [domainBuilder.certification.enrolment.buildCoreSubscription({ certificationCandidateId: null })],
    organizationLearnerId: null,
    userId: null,
  };
  const secondCandidate = {
    id: null,
    sessionId,
    createdAt: null,
    lastName: 'Jackson',
    firstName: 'Janet',
    birthdate: '2005-12-05',
    sex: 'F',
    birthCity: 'AJACCIO',
    birthCountry: 'FRANCE',
    birthINSEECode: '2A004',
    birthPostalCode: null,
    birthProvinceCode: null,
    resultRecipientEmail: 'destinataire@gmail.com',
    email: 'jaja@hotmail.fr',
    externalId: 'DEF456',
    extraTimePercentage: null,
    billingMode: hasBillingMode ? BILLING_MODES.FREE : null,
    prepaymentCode: null,
    subscriptions: [domainBuilder.certification.enrolment.buildCoreSubscription({ certificationCandidateId: null })],
    organizationLearnerId: null,
    userId: null,
  };

  if (hasBillingMode) {
    return [firstCandidate, secondCandidate];
  }
  if (complementaryCertifications.length > 0) {
    // CLEA
    secondCandidate.subscriptions = [
      domainBuilder.certification.enrolment.buildComplementarySubscription({
        certificationCandidateId: null,
        complementaryCertificationKey: ComplementaryCertificationKeys.CLEA,
      }),
      domainBuilder.certification.enrolment.buildCoreSubscription({ certificationCandidateId: null }),
    ];

    firstCandidate.billingMode = BILLING_MODES.FREE;
    secondCandidate.billingMode = BILLING_MODES.FREE;
  }
  return [firstCandidate, secondCandidate];
}
