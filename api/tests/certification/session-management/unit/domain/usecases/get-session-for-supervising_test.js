import dayjs from 'dayjs';
import sinon from 'sinon';

import { getSessionForSupervising } from '../../../../../../src/certification/session-management/domain/usecases/get-session-for-supervising.js';
import { DEFAULT_SESSION_DURATION_MINUTES } from '../../../../../../src/certification/shared/domain/constants.js';
import { Frameworks } from '../../../../../../src/certification/shared/domain/models/Frameworks.js';
import { expect } from '../../../../../test-helper.js';
import { domainBuilder } from '../../../../../tooling/domain-builder/domain-builder.js';

const START_DATETIME_STUB = new Date('2022-10-01T13:00:00Z');
const sessionForSupervisingRepository = { get: sinon.stub() };

const expectedSessionEndDateTimeFromStartDateTime = (startDateTime, extraMinutes = []) => {
  let computedEndDateTime = dayjs(startDateTime);
  extraMinutes.forEach((plusMinutes) => {
    computedEndDateTime = computedEndDateTime.add(plusMinutes, 'minute');
  });
  return computedEndDateTime.toDate();
};

describe('Unit | UseCase | get-session-for-supervising', function () {
  context('when the session exists', function () {
    context('when there are candidates', function () {
      context('when the session has not started yet', function () {
        it('should not compute a theorical end datetime', async function () {
          // given
          const certificationCandidateNotStarted = domainBuilder.buildCertificationCandidateForSupervising();
          delete certificationCandidateNotStarted.startDateTime;

          const session = domainBuilder.buildSessionForSupervising({
            certificationCandidates: [certificationCandidateNotStarted],
          });
          sessionForSupervisingRepository.get.resolves(session);

          // when
          const sessionForSupervising = await getSessionForSupervising({
            sessionId: 1,
            sessionForSupervisingRepository,
          });

          // then
          expect(sessionForSupervising.certificationCandidates).to.have.lengthOf(1);
          expect(sessionForSupervising.certificationCandidates[0].startDateTime).to.be.undefined;
          expect(sessionForSupervising.certificationCandidates[0].theoricalEndDateTime).to.be.undefined;
        });
      });

      context('when the session has started', function () {
        it('should get certification candidates with theorical end datetime', async function () {
          // given
          const sessionId = 1;
          const certificationCandidateId = 51;
          const certificationCandidateWithNoComplementaryCertification =
            domainBuilder.buildCertificationCandidateForSupervising({
              id: certificationCandidateId,
              subscription: Frameworks.CORE,
            });

          const session = domainBuilder.buildSessionForSupervising({
            sessionId,
            certificationCandidates: [certificationCandidateWithNoComplementaryCertification],
          });
          sessionForSupervisingRepository.get.resolves(session);
          const expectedTheoricalEndDateTime = dayjs(
            certificationCandidateWithNoComplementaryCertification.startDateTime,
          )
            .add(DEFAULT_SESSION_DURATION_MINUTES, 'minute')
            .toDate();

          // when
          const { certificationCandidates } = await getSessionForSupervising({
            sessionId,
            sessionForSupervisingRepository,
          });
          // then
          const [certificationCandidate] = certificationCandidates;
          expect(certificationCandidate).to.have.deep.property(
            'startDateTime',
            certificationCandidateWithNoComplementaryCertification.startDateTime,
          );
          expect(certificationCandidate).to.have.deep.property('theoricalEndDateTime', expectedTheoricalEndDateTime);
        });

        context('when candidates are registered to CLEA (double certification)', function () {
          context('when candidate is still eligible', function () {
            it("returns the session with the candidate's eligibility and badge acquisitions fetched", async function () {
              // given
              const stillValidBadgeAcquisition = domainBuilder.buildCertifiableBadgeAcquisition({
                complementaryCertificationKey: Frameworks.CLEA,
              });

              const retrievedSessionForSupervising = domainBuilder.buildSessionForSupervising({
                certificationCandidates: [
                  domainBuilder.buildCertificationCandidateForSupervising({
                    userId: 1234,
                    startDateTime: START_DATETIME_STUB,
                    subscription: Frameworks.CLEA,
                    stillValidBadgeAcquisitions: [],
                  }),
                ],
              });

              sessionForSupervisingRepository.get.resolves(retrievedSessionForSupervising);

              const certificationBadgesService = { findStillValidBadgeAcquisitions: sinon.stub() };
              certificationBadgesService.findStillValidBadgeAcquisitions
                .withArgs({ userId: 1234 })
                .resolves([stillValidBadgeAcquisition]);

              // when
              const actualSession = await getSessionForSupervising({
                sessionId: 1,
                sessionForSupervisingRepository,
                certificationBadgesService,
              });

              // then
              expect(actualSession.certificationCandidates[0].isStillEligibleToDoubleCertification).to.be.true;
              expect(actualSession.certificationCandidates[0].theoricalEndDateTime).to.deep.equal(
                expectedSessionEndDateTimeFromStartDateTime(START_DATETIME_STUB, [DEFAULT_SESSION_DURATION_MINUTES]),
              );
            });
          });

          context('when candidate is not eligible', function () {
            it("returns the session with the candidate's non eligibility", async function () {
              // given
              sessionForSupervisingRepository.get.resolves(
                domainBuilder.buildSessionForSupervising({
                  certificationCandidates: [
                    domainBuilder.buildCertificationCandidateForSupervising({
                      userId: 1234,
                      startDateTime: START_DATETIME_STUB,
                      subscription: Frameworks.CLEA,
                      stillValidBadgeAcquisitions: [],
                    }),
                  ],
                }),
              );

              const certificationBadgesService = { findStillValidBadgeAcquisitions: sinon.stub() };
              certificationBadgesService.findStillValidBadgeAcquisitions.withArgs({ userId: 1234 }).resolves([]);

              // when
              const actualSession = await getSessionForSupervising({
                sessionId: 1,
                sessionForSupervisingRepository,
                certificationBadgesService,
              });

              // then
              expect(actualSession.certificationCandidates[0].isStillEligibleToDoubleCertification).to.be.false;
              expect(actualSession.certificationCandidates[0].theoricalEndDateTime).to.deep.equal(
                expectedSessionEndDateTimeFromStartDateTime(START_DATETIME_STUB, [DEFAULT_SESSION_DURATION_MINUTES]),
              );
            });
          });
        });
      });
    });
  });
});
