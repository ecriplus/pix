const { expect, databaseBuilder, domainBuilder, catchErr, learningContentBuilder, mockLearningContent } = require('../../../test-helper');
const { NotFoundError } = require('../../../../lib/domain/errors');
const _ = require('lodash');
const shareableCertificateRepository = require('../../../../lib/infrastructure/repositories/shareable-certificate-repository');
const ShareableCertificate = require('../../../../lib/domain/models/ShareableCertificate');
const { badgeKey: cleaBadgeKey } = require('../../../../lib/domain/models/CleaCertificationResult');
const { badgeKey: pixPlusDroitMaitreBadgeKey } = require('../../../../lib/domain/models/PixPlusDroitMaitreCertificationResult');
const { badgeKey: pixPlusDroitExpertBadgeKey } = require('../../../../lib/domain/models/PixPlusDroitExpertCertificationResult');

describe('Integration | Infrastructure | Repository | Shareable Certificate', () => {

  const minimalLearningContent = [{
    id: 'recArea0',
    code: '1',
    competences: [{
      id: 'recNv8qhaY887jQb2',
      index: '1.3',
      name: 'Traiter des données',
    }],
  }];

  describe('#getByVerificationCode', () => {

    it('should throw a NotFoundError when shareable certificate does not exist', async () => {
      // when
      const error = await catchErr(shareableCertificateRepository.getByVerificationCode)('P-SOMECODE');

      // then
      expect(error).to.be.instanceOf(NotFoundError);
      expect(error.message).to.equal('There is no certification course with verification code "P-SOMECODE"');
    });

    it('should throw a NotFoundError when certificate has no assessment-result', async () => {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const shareableCertificateData = {
        firstName: 'Sarah Michelle',
        lastName: 'Gellar',
        birthdate: '1977-04-14',
        birthplace: 'Saint-Ouen',
        isPublished: true,
        userId,
        date: new Date('2020-01-01'),
        verificationCode: 'P-SOMECODE',
        maxReachableLevelOnCertificationDate: 5,
        deliveredAt: new Date('2021-05-05'),
        certificationCenter: 'Centre des poules bien dodues',
        pixScore: 51,
      };
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
      const sessionId = databaseBuilder.factory.buildSession({
        publishedAt: shareableCertificateData.deliveredAt,
        certificationCenter: shareableCertificateData.certificationCenter,
        certificationCenterId,
      }).id;
      const certificateId = databaseBuilder.factory.buildCertificationCourse({
        firstName: shareableCertificateData.firstName,
        lastName: shareableCertificateData.lastName,
        birthdate: shareableCertificateData.birthdate,
        birthplace: shareableCertificateData.birthplace,
        isPublished: shareableCertificateData.isPublished,
        isCancelled: false,
        createdAt: shareableCertificateData.date,
        verificationCode: shareableCertificateData.verificationCode,
        maxReachableLevelOnCertificationDate: shareableCertificateData.maxReachableLevelOnCertificationDate,
        sessionId,
        userId,
      }).id;
      databaseBuilder.factory.buildAssessment({ certificationCourseId: certificateId }).id;
      await databaseBuilder.commit();

      // when
      const error = await catchErr(shareableCertificateRepository.getByVerificationCode)('P-SOMECODE');

      // then
      expect(error).to.be.instanceOf(NotFoundError);
      expect(error.message).to.equal('There is no certification course with verification code "P-SOMECODE"');
    });

    it('should throw a NotFoundError when certificate is cancelled', async () => {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const shareableCertificateData = {
        firstName: 'Sarah Michelle',
        lastName: 'Gellar',
        birthdate: '1977-04-14',
        birthplace: 'Saint-Ouen',
        isPublished: true,
        userId,
        date: new Date('2020-01-01'),
        verificationCode: 'P-SOMECODE',
        maxReachableLevelOnCertificationDate: 5,
        deliveredAt: new Date('2021-05-05'),
        certificationCenter: 'Centre des poules bien dodues',
        pixScore: 51,
      };
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
      const sessionId = databaseBuilder.factory.buildSession({
        publishedAt: shareableCertificateData.deliveredAt,
        certificationCenter: shareableCertificateData.certificationCenter,
        certificationCenterId,
      }).id;
      const certificateId = databaseBuilder.factory.buildCertificationCourse({
        firstName: shareableCertificateData.firstName,
        lastName: shareableCertificateData.lastName,
        birthdate: shareableCertificateData.birthdate,
        birthplace: shareableCertificateData.birthplace,
        isPublished: shareableCertificateData.isPublished,
        isCancelled: true,
        createdAt: shareableCertificateData.date,
        verificationCode: shareableCertificateData.verificationCode,
        maxReachableLevelOnCertificationDate: shareableCertificateData.maxReachableLevelOnCertificationDate,
        sessionId,
        userId,
      }).id;
      const assessmentId = databaseBuilder.factory.buildAssessment({ certificationCourseId: certificateId }).id;
      databaseBuilder.factory.buildAssessmentResult({
        assessmentId,
        pixScore: shareableCertificateData.pixScore,
        status: 'validated',
      });
      await databaseBuilder.commit();

      // when
      const error = await catchErr(shareableCertificateRepository.getByVerificationCode)('P-SOMECODE');

      // then
      expect(error).to.be.instanceOf(NotFoundError);
      expect(error.message).to.equal('There is no certification course with verification code "P-SOMECODE"');
    });

    it('should throw a NotFoundError when certificate is not published', async () => {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const shareableCertificateData = {
        firstName: 'Sarah Michelle',
        lastName: 'Gellar',
        birthdate: '1977-04-14',
        birthplace: 'Saint-Ouen',
        isPublished: false,
        userId,
        date: new Date('2020-01-01'),
        verificationCode: 'P-SOMECODE',
        maxReachableLevelOnCertificationDate: 5,
        deliveredAt: new Date('2021-05-05'),
        certificationCenter: 'Centre des poules bien dodues',
        pixScore: 51,
      };
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
      const sessionId = databaseBuilder.factory.buildSession({
        publishedAt: shareableCertificateData.deliveredAt,
        certificationCenter: shareableCertificateData.certificationCenter,
        certificationCenterId,
      }).id;
      const certificateId = databaseBuilder.factory.buildCertificationCourse({
        firstName: shareableCertificateData.firstName,
        lastName: shareableCertificateData.lastName,
        birthdate: shareableCertificateData.birthdate,
        birthplace: shareableCertificateData.birthplace,
        isPublished: shareableCertificateData.isPublished,
        isCancelled: false,
        createdAt: shareableCertificateData.date,
        verificationCode: shareableCertificateData.verificationCode,
        maxReachableLevelOnCertificationDate: shareableCertificateData.maxReachableLevelOnCertificationDate,
        sessionId,
        userId,
      }).id;
      const assessmentId = databaseBuilder.factory.buildAssessment({ certificationCourseId: certificateId }).id;
      databaseBuilder.factory.buildAssessmentResult({
        assessmentId,
        pixScore: shareableCertificateData.pixScore,
        status: 'validated',
      });
      await databaseBuilder.commit();

      // when
      const error = await catchErr(shareableCertificateRepository.getByVerificationCode)('P-SOMECODE');

      // then
      expect(error).to.be.instanceOf(NotFoundError);
      expect(error.message).to.equal('There is no certification course with verification code "P-SOMECODE"');
    });

    it('should throw a NotFoundError when certificate is rejected', async () => {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const shareableCertificateData = {
        firstName: 'Sarah Michelle',
        lastName: 'Gellar',
        birthdate: '1977-04-14',
        birthplace: 'Saint-Ouen',
        isPublished: true,
        userId,
        date: new Date('2020-01-01'),
        verificationCode: 'P-SOMECODE',
        maxReachableLevelOnCertificationDate: 5,
        deliveredAt: new Date('2021-05-05'),
        certificationCenter: 'Centre des poules bien dodues',
        pixScore: 51,
      };
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
      const sessionId = databaseBuilder.factory.buildSession({
        publishedAt: shareableCertificateData.deliveredAt,
        certificationCenter: shareableCertificateData.certificationCenter,
        certificationCenterId,
      }).id;
      const certificateId = databaseBuilder.factory.buildCertificationCourse({
        firstName: shareableCertificateData.firstName,
        lastName: shareableCertificateData.lastName,
        birthdate: shareableCertificateData.birthdate,
        birthplace: shareableCertificateData.birthplace,
        isPublished: shareableCertificateData.isPublished,
        isCancelled: false,
        createdAt: shareableCertificateData.date,
        verificationCode: shareableCertificateData.verificationCode,
        maxReachableLevelOnCertificationDate: shareableCertificateData.maxReachableLevelOnCertificationDate,
        sessionId,
        userId,
      }).id;
      const assessmentId = databaseBuilder.factory.buildAssessment({ certificationCourseId: certificateId }).id;
      databaseBuilder.factory.buildAssessmentResult({
        assessmentId,
        pixScore: shareableCertificateData.pixScore,
        status: 'rejected',
      });
      await databaseBuilder.commit();

      // when
      const error = await catchErr(shareableCertificateRepository.getByVerificationCode)('P-SOMECODE');

      // then
      expect(error).to.be.instanceOf(NotFoundError);
      expect(error.message).to.equal('There is no certification course with verification code "P-SOMECODE"');
    });

    it('should return a ShareableCertificate', async () => {
      // given
      const learningContentObjects = learningContentBuilder.buildLearningContent(minimalLearningContent);
      mockLearningContent(learningContentObjects);

      const userId = databaseBuilder.factory.buildUser().id;
      const shareableCertificateData = {
        id: 123,
        firstName: 'Sarah Michelle',
        lastName: 'Gellar',
        birthdate: '1977-04-14',
        birthplace: 'Saint-Ouen',
        isPublished: true,
        userId,
        date: new Date('2020-01-01'),
        verificationCode: 'P-SOMECODE',
        maxReachableLevelOnCertificationDate: 5,
        deliveredAt: new Date('2021-05-05'),
        certificationCenter: 'Centre des poules bien dodues',
        pixScore: 51,
        cleaCertificationResult: domainBuilder.buildCleaCertificationResult.notTaken(),
      };

      const { certificateId } = await _buildValidShareableCertificate(shareableCertificateData);

      // when
      const shareableCertificate = await shareableCertificateRepository.getByVerificationCode('P-SOMECODE');

      // then
      const expectedShareableCertificate = domainBuilder.buildShareableCertificate({
        id: certificateId,
        ...shareableCertificateData,
      });
      expect(shareableCertificate).to.be.instanceOf(ShareableCertificate);
      expect(_.omit(shareableCertificate, ['resultCompetenceTree'])).to.deep.equal(_.omit(expectedShareableCertificate, ['resultCompetenceTree']));
    });

    it('should return a ShareableCertificate with resultCompetenceTree', async () => {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const shareableCertificateData = {
        id: 123,
        firstName: 'Sarah Michelle',
        lastName: 'Gellar',
        birthdate: '1977-04-14',
        birthplace: 'Saint-Ouen',
        isPublished: true,
        userId,
        date: new Date('2020-01-01'),
        verificationCode: 'P-SOMECODE',
        maxReachableLevelOnCertificationDate: 5,
        deliveredAt: new Date('2021-05-05'),
        certificationCenter: 'Centre des poules bien dodues',
        pixScore: 51,
        cleaCertificationResult: domainBuilder.buildCleaCertificationResult.notTaken(),
      };

      const { certificateId, assessmentResultId } = await _buildValidShareableCertificate(shareableCertificateData, false);

      const competenceMarks1 = domainBuilder.buildCompetenceMark({
        id: 1234,
        level: 4,
        score: 32,
        area_code: '1',
        competence_code: '1.1',
        competenceId: 'recComp1',
        assessmentResultId,
      });
      databaseBuilder.factory.buildCompetenceMark(competenceMarks1);

      const competenceMarks2 = domainBuilder.buildCompetenceMark({
        id: 4567,
        level: 5,
        score: 40,
        area_code: '1',
        competence_code: '1.2',
        competenceId: 'recComp2',
        assessmentResultId,
      });
      databaseBuilder.factory.buildCompetenceMark(competenceMarks2);

      await databaseBuilder.commit();

      const competence1 = domainBuilder.buildCompetence({
        id: 'recComp1',
        index: '1.1',
        name: 'Traiter des données',
      });
      const competence2 = domainBuilder.buildCompetence({
        id: 'recComp2',
        index: '1.2',
        name: 'Traiter des choux',
      });
      const area1 = domainBuilder.buildArea({
        id: 'recArea1',
        code: '1',
        competences: [competence1, competence2],
        title: 'titre test',
      });

      const learningContentObjects = learningContentBuilder.buildLearningContent([{ ...area1, titleFr: area1.title }]);
      mockLearningContent(learningContentObjects);

      // when
      const shareableCertificate = await shareableCertificateRepository.getByVerificationCode('P-SOMECODE');

      // then
      const resultCompetenceTree = domainBuilder.buildResultCompetenceTree({
        id: `${certificateId}-${assessmentResultId}`,
        competenceMarks: [competenceMarks1, competenceMarks2],
        competenceTree: domainBuilder.buildCompetenceTree({ areas: [area1] }),
      });
      const expectedShareableCertificate = domainBuilder.buildShareableCertificate({
        id: certificateId,
        ...shareableCertificateData,
        resultCompetenceTree,
      });
      expect(shareableCertificate).to.be.instanceOf(ShareableCertificate);
      expect(shareableCertificate).to.deep.equal(expectedShareableCertificate);
    });

    it('should get the clea certification result if taken', async () => {
      // given
      const learningContentObjects = learningContentBuilder.buildLearningContent(minimalLearningContent);
      mockLearningContent(learningContentObjects);

      const userId = databaseBuilder.factory.buildUser().id;
      const shareableCertificateData = {
        id: 123,
        firstName: 'Sarah Michelle',
        lastName: 'Gellar',
        birthdate: '1977-04-14',
        birthplace: 'Saint-Ouen',
        isPublished: true,
        userId,
        date: new Date('2020-01-01'),
        verificationCode: 'P-SOMECODE',
        maxReachableLevelOnCertificationDate: 5,
        deliveredAt: new Date('2021-05-05'),
        certificationCenter: 'Centre des poules bien dodues',
        pixScore: 51,
        cleaCertificationResult: domainBuilder.buildCleaCertificationResult.acquired(),
      };

      const { certificateId } = await _buildValidShareableCertificateWithClea(shareableCertificateData);

      // when
      const shareableCertificate = await shareableCertificateRepository.getByVerificationCode('P-SOMECODE');

      // then
      const expectedShareableCertificate = domainBuilder.buildShareableCertificate({
        id: certificateId,
        ...shareableCertificateData,
      });
      expect(shareableCertificate).to.be.instanceOf(ShareableCertificate);
      expect(_.omit(shareableCertificate, ['resultCompetenceTree'])).to.deep.equal(_.omit(expectedShareableCertificate, ['resultCompetenceTree']));
    });

    context('acquired certifiable badges', () => {

      it('should get the certified badge images of pixPlusDroitMaitre and/or pixPlusDroitExpert when those certifications were acquired', async () => {
        // given
        const learningContentObjects = learningContentBuilder.buildLearningContent(minimalLearningContent);
        mockLearningContent(learningContentObjects);
        const userId = databaseBuilder.factory.buildUser().id;
        const shareableCertificateData = {
          id: 123,
          firstName: 'Sarah Michelle',
          lastName: 'Gellar',
          birthdate: '1977-04-14',
          birthplace: 'Saint-Ouen',
          isPublished: true,
          userId,
          date: new Date('2020-01-01'),
          verificationCode: 'P-SOMECODE',
          maxReachableLevelOnCertificationDate: 5,
          deliveredAt: new Date('2021-05-05'),
          certificationCenter: 'Centre des poules bien dodues',
          pixScore: 51,
          cleaCertificationResult: domainBuilder.buildCleaCertificationResult.notTaken(),
          certifiedBadgeImages: [
            'https://images.pix.fr/badges-certifies/pix-droit/expert.svg',
            'https://images.pix.fr/badges-certifies/pix-droit/maitre.svg',
          ],
        };

        const { certificateId } = await _buildValidShareableCertificateWithBothAcquiredPixPlusDroitBadges(shareableCertificateData);

        // when
        const shareableCertificate = await shareableCertificateRepository.getByVerificationCode('P-SOMECODE');

        // then
        const expectedShareableCertificate = domainBuilder.buildShareableCertificate({
          id: certificateId,
          ...shareableCertificateData,
        });
        expect(shareableCertificate).to.be.instanceOf(ShareableCertificate);
        expect(_.omit(shareableCertificate, ['resultCompetenceTree'])).to.deep.equal(_.omit(expectedShareableCertificate, ['resultCompetenceTree']));
      });

      it('should only take into account acquired ones', async () => {
        // given
        const learningContentObjects = learningContentBuilder.buildLearningContent(minimalLearningContent);
        mockLearningContent(learningContentObjects);
        const userId = databaseBuilder.factory.buildUser().id;
        const shareableCertificateData = {
          id: 123,
          firstName: 'Sarah Michelle',
          lastName: 'Gellar',
          birthdate: '1977-04-14',
          birthplace: 'Saint-Ouen',
          isPublished: true,
          userId,
          date: new Date('2020-01-01'),
          verificationCode: 'P-SOMECODE',
          maxReachableLevelOnCertificationDate: 5,
          deliveredAt: new Date('2021-05-05'),
          certificationCenter: 'Centre des poules bien dodues',
          pixScore: 51,
          cleaCertificationResult: domainBuilder.buildCleaCertificationResult.notTaken(),
          certifiedBadgeImages: [
            'https://images.pix.fr/badges-certifies/pix-droit/expert.svg',
          ],
        };

        const { certificateId } = await _buildValidShareableCertificateWithOneAcquiredPixPlusDroitBadge(shareableCertificateData);

        // when
        const shareableCertificate = await shareableCertificateRepository.getByVerificationCode('P-SOMECODE');

        // then
        const expectedShareableCertificate = domainBuilder.buildShareableCertificate({
          id: certificateId,
          ...shareableCertificateData,
        });
        expect(shareableCertificate).to.be.instanceOf(ShareableCertificate);
        expect(_.omit(shareableCertificate, ['resultCompetenceTree'])).to.deep.equal(_.omit(expectedShareableCertificate, ['resultCompetenceTree']));
      });
    });
  });
});

async function _buildValidShareableCertificate(shareableCertificateData, buildCompetenceMark = true) {
  const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
  const sessionId = databaseBuilder.factory.buildSession({
    id: shareableCertificateData.sessionId,
    publishedAt: shareableCertificateData.deliveredAt,
    certificationCenter: shareableCertificateData.certificationCenter,
    certificationCenterId,
  }).id;
  const certificateId = databaseBuilder.factory.buildCertificationCourse({
    id: shareableCertificateData.id,
    firstName: shareableCertificateData.firstName,
    lastName: shareableCertificateData.lastName,
    birthdate: shareableCertificateData.birthdate,
    birthplace: shareableCertificateData.birthplace,
    isPublished: shareableCertificateData.isPublished,
    isCancelled: false,
    createdAt: shareableCertificateData.date,
    verificationCode: shareableCertificateData.verificationCode,
    maxReachableLevelOnCertificationDate: shareableCertificateData.maxReachableLevelOnCertificationDate,
    sessionId,
    userId: shareableCertificateData.userId,
  }).id;
  const assessmentId = databaseBuilder.factory.buildAssessment({ certificationCourseId: shareableCertificateData.id }).id;
  const assessmentResultId = databaseBuilder.factory.buildAssessmentResult({
    assessmentId,
    pixScore: shareableCertificateData.pixScore,
    status: 'validated',
    createdAt: new Date('2020-01-02'),
  }).id;

  if (buildCompetenceMark) {
    databaseBuilder.factory.buildCompetenceMark({
      assessmentResultId,
    });
  }

  await databaseBuilder.commit();

  return { certificateId, assessmentResultId };
}

async function _buildValidShareableCertificateWithClea(shareableCertificateData) {
  const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
  const sessionId = databaseBuilder.factory.buildSession({
    id: shareableCertificateData.sessionId,
    publishedAt: shareableCertificateData.deliveredAt,
    certificationCenter: shareableCertificateData.certificationCenter,
    certificationCenterId,
  }).id;
  const certificateId = databaseBuilder.factory.buildCertificationCourse({
    id: shareableCertificateData.id,
    firstName: shareableCertificateData.firstName,
    lastName: shareableCertificateData.lastName,
    birthdate: shareableCertificateData.birthdate,
    birthplace: shareableCertificateData.birthplace,
    isPublished: shareableCertificateData.isPublished,
    isCancelled: false,
    createdAt: shareableCertificateData.date,
    verificationCode: shareableCertificateData.verificationCode,
    maxReachableLevelOnCertificationDate: shareableCertificateData.maxReachableLevelOnCertificationDate,
    sessionId,
    userId: shareableCertificateData.userId,
  }).id;
  const assessmentId = databaseBuilder.factory.buildAssessment({ certificationCourseId: shareableCertificateData.id }).id;
  const assessmentResultId = databaseBuilder.factory.buildAssessmentResult({
    assessmentId,
    pixScore: shareableCertificateData.pixScore,
    status: 'validated',
    createdAt: new Date('2020-01-02'),
  }).id;

  databaseBuilder.factory.buildBadge({ key: cleaBadgeKey });
  databaseBuilder.factory.buildPartnerCertification({ certificationCourseId: certificateId, partnerKey: cleaBadgeKey, acquired: true });

  databaseBuilder.factory.buildCompetenceMark({
    assessmentResultId,
  });

  await databaseBuilder.commit();

  return { certificateId };
}

async function _buildValidShareableCertificateWithBothAcquiredPixPlusDroitBadges(shareableCertificateData) {
  const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
  const sessionId = databaseBuilder.factory.buildSession({
    publishedAt: shareableCertificateData.deliveredAt,
    certificationCenter: shareableCertificateData.certificationCenter,
    certificationCenterId,
  }).id;
  const certificateId = databaseBuilder.factory.buildCertificationCourse({
    id: shareableCertificateData.id,
    firstName: shareableCertificateData.firstName,
    lastName: shareableCertificateData.lastName,
    birthdate: shareableCertificateData.birthdate,
    birthplace: shareableCertificateData.birthplace,
    isPublished: shareableCertificateData.isPublished,
    isCancelled: false,
    createdAt: shareableCertificateData.date,
    verificationCode: shareableCertificateData.verificationCode,
    maxReachableLevelOnCertificationDate: shareableCertificateData.maxReachableLevelOnCertificationDate,
    sessionId,
    userId: shareableCertificateData.userId,
  }).id;
  const assessmentId = databaseBuilder.factory.buildAssessment({ certificationCourseId: certificateId }).id;
  const assessmentResultId = databaseBuilder.factory.buildAssessmentResult({
    assessmentId,
    pixScore: shareableCertificateData.pixScore,
    status: 'validated',
  }).id;
  databaseBuilder.factory.buildBadge({ key: pixPlusDroitExpertBadgeKey });
  databaseBuilder.factory.buildBadge({ key: pixPlusDroitMaitreBadgeKey });
  databaseBuilder.factory.buildBadge({ key: 'should_be_ignored' });
  databaseBuilder.factory.buildPartnerCertification({ certificationCourseId: certificateId, partnerKey: pixPlusDroitExpertBadgeKey, acquired: true });
  databaseBuilder.factory.buildPartnerCertification({ certificationCourseId: certificateId, partnerKey: pixPlusDroitMaitreBadgeKey, acquired: true });
  databaseBuilder.factory.buildPartnerCertification({ certificationCourseId: certificateId, partnerKey: 'should_be_ignored', acquired: true });
  databaseBuilder.factory.buildCompetenceMark({
    assessmentResultId,
  });

  await databaseBuilder.commit();

  return { certificateId };
}

async function _buildValidShareableCertificateWithOneAcquiredPixPlusDroitBadge(shareableCertificateData) {
  const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
  const sessionId = databaseBuilder.factory.buildSession({
    publishedAt: shareableCertificateData.deliveredAt,
    certificationCenter: shareableCertificateData.certificationCenter,
    certificationCenterId,
  }).id;
  const certificateId = databaseBuilder.factory.buildCertificationCourse({
    id: shareableCertificateData.id,
    firstName: shareableCertificateData.firstName,
    lastName: shareableCertificateData.lastName,
    birthdate: shareableCertificateData.birthdate,
    birthplace: shareableCertificateData.birthplace,
    isPublished: shareableCertificateData.isPublished,
    isCancelled: false,
    createdAt: shareableCertificateData.date,
    verificationCode: shareableCertificateData.verificationCode,
    maxReachableLevelOnCertificationDate: shareableCertificateData.maxReachableLevelOnCertificationDate,
    sessionId,
    userId: shareableCertificateData.userId,
  }).id;
  const assessmentId = databaseBuilder.factory.buildAssessment({ certificationCourseId: certificateId }).id;
  const assessmentResultId = databaseBuilder.factory.buildAssessmentResult({
    assessmentId,
    pixScore: shareableCertificateData.pixScore,
    status: 'validated',
  }).id;
  databaseBuilder.factory.buildBadge({ key: pixPlusDroitExpertBadgeKey });
  databaseBuilder.factory.buildBadge({ key: pixPlusDroitMaitreBadgeKey });
  databaseBuilder.factory.buildBadge({ key: 'should_be_ignored' });
  databaseBuilder.factory.buildPartnerCertification({ certificationCourseId: certificateId, partnerKey: pixPlusDroitExpertBadgeKey, acquired: true });
  databaseBuilder.factory.buildPartnerCertification({ certificationCourseId: certificateId, partnerKey: pixPlusDroitMaitreBadgeKey, acquired: false });
  databaseBuilder.factory.buildPartnerCertification({ certificationCourseId: certificateId, partnerKey: 'should_be_ignored', acquired: true });
  databaseBuilder.factory.buildCompetenceMark({
    assessmentResultId,
  });

  await databaseBuilder.commit();

  return { certificateId };
}
