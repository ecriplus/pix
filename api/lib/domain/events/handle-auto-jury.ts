// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkEvent... Remove this comment to see the full error message
const { checkEventTypes } = require('./check-event-types');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionFin... Remove this comment to see the full error message
const SessionFinalized = require('./SessionFinalized');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationIssueReportResolutionAttempt = require('../models/CertificationIssueReportResolutionAttempt');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AutoJuryDo... Remove this comment to see the full error message
const AutoJuryDone = require('./AutoJuryDone');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationJuryDone = require('./CertificationJuryDone');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportResolutionStrategies,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../models/CertificationIssueReportResolutionStrategies');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'eventTypes... Remove this comment to see the full error message
const eventTypes = [SessionFinalized];

async function handleAutoJury({
  event,
  certificationIssueReportRepository,
  certificationAssessmentRepository,
  certificationCourseRepository,
  challengeRepository,
  logger
}: $TSFixMe) {
  checkEventTypes(event, eventTypes);
  const certificationCourses = await certificationCourseRepository.findCertificationCoursesBySessionId({
    sessionId: event.sessionId,
  });

  const resolutionStrategies = new CertificationIssueReportResolutionStrategies({
    certificationIssueReportRepository,
    challengeRepository,
  });

  const certificationJuryDoneEvents = [];

  for (const certificationCourse of certificationCourses) {
    const certificationAssessment = await certificationAssessmentRepository.getByCertificationCourseId({
      certificationCourseId: certificationCourse.getId(),
    });

    const hasAutoCompleteAnEffectOnScoring = await _autoCompleteUnfinishedTest({
      certificationCourse,
      certificationAssessment,
      certificationAssessmentRepository,
    });

    const hasAutoResolutionAnEffectOnScoring = await _autoResolveCertificationIssueReport({
      certificationCourse,
      certificationAssessment,
      certificationIssueReportRepository,
      certificationAssessmentRepository,
      resolutionStrategies,
      logger,
    });

    if (hasAutoResolutionAnEffectOnScoring || hasAutoCompleteAnEffectOnScoring) {
      const certificationJuryDoneEvent = new CertificationJuryDone({
        certificationCourseId: certificationCourse.getId(),
      });

      certificationJuryDoneEvents.push(certificationJuryDoneEvent);
    }
  }

  return [
    ...certificationJuryDoneEvents,
    new AutoJuryDone({
      sessionId: event.sessionId,
      finalizedAt: event.finalizedAt,
      certificationCenterName: event.certificationCenterName,
      sessionDate: event.sessionDate,
      sessionTime: event.sessionTime,
      hasExaminerGlobalComment: event.hasExaminerGlobalComment,
    }),
  ];
}

async function _autoCompleteUnfinishedTest({
  certificationCourse,
  certificationAssessment,
  certificationAssessmentRepository
}: $TSFixMe) {
  if (certificationCourse.isCompleted()) {
    return false;
  }

  if (certificationCourse.isAbortReasonCandidateRelated()) {
    certificationAssessment.skipUnansweredChallenges();
  }

  if (certificationCourse.isAbortReasonCandidateUnrelated()) {
    certificationAssessment.neutralizeUnansweredChallenges();
  }

  certificationAssessment.endDueToFinalization();

  await certificationAssessmentRepository.save(certificationAssessment);

  return true;
}

async function _autoResolveCertificationIssueReport({
  certificationCourse,
  certificationAssessment,
  certificationIssueReportRepository,
  certificationAssessmentRepository,
  resolutionStrategies,
  logger
}: $TSFixMe) {
  const certificationIssueReports = await certificationIssueReportRepository.findByCertificationCourseId(
    certificationCourse.getId()
  );
  if (certificationIssueReports.length === 0) {
    return null;
  }

  const resolutionAttempts = await bluebird.mapSeries(certificationIssueReports, async (certificationIssueReport: $TSFixMe) => {
    try {
      return await resolutionStrategies.resolve({ certificationIssueReport, certificationAssessment });
    } catch (e) {
      logger.error(e);
      return CertificationIssueReportResolutionAttempt.unresolved();
    }
  });

  if (resolutionAttempts.some((attempt: $TSFixMe) => attempt.isResolvedWithEffect())) {
    await certificationAssessmentRepository.save(certificationAssessment);
    return true;
  }

  return false;
}

// @ts-expect-error TS(2454): Variable 'handleAutoJury' is used before being ass... Remove this comment to see the full error message
handleAutoJury.eventTypes = eventTypes;
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = handleAutoJury;
