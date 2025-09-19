import * as serializer from '../../../../../../../src/certification/shared/infrastructure/serializers/jsonapi/certification-candidate-serializer.js';
import { domainBuilder, expect } from '../../../../../../test-helper.js';

describe('Unit | Serializer | JSONAPI | certification-candidate-serializer', function () {
  context('#serialize()', function () {
    it('should convert a CertificationCandidate model object into JSON API data for app', async function () {
      // given
      const certificationCandidate = domainBuilder.certification.enrolment.buildCertificationSessionCandidate({
        firstName: 'toto',
        lastName: 'tutu',
        sessionId: 1234,
        hasSeenCertificationInstructions: true,
        birthdate: '1984-28-05',
      });

      // when
      const serializedCertificationCandidateForApp = await serializer.serialize(certificationCandidate);

      // then
      expect(serializedCertificationCandidateForApp).to.deep.equal({
        data: {
          type: 'certification-candidates',
          id: certificationCandidate.id.toString(),
          attributes: {
            'first-name': 'toto',
            'last-name': 'tutu',
            birthdate: '1984-28-05',
            'session-id': 1234,
            'has-seen-certification-instructions': true,
            'complementary-certification-key': null,
          },
        },
      });
    });

    it('should serialize complementary certification key when present', async function () {
      // given
      const certificationCandidate = domainBuilder.certification.enrolment.buildCandidate({
        firstName: 'John',
        lastName: 'Doe',
        sessionId: 5678,
        hasSeenCertificationInstructions: false,
        birthdate: '1990-12-25',
        subscriptions: [
          domainBuilder.certification.enrolment.buildComplementarySubscription({
            certificationCandidateId: null,
            complementaryCertificationKey: 'DROIT',
          }),
        ],
      });

      // when
      const serializedCertificationCandidateForApp = await serializer.serialize(certificationCandidate);

      // then
      expect(serializedCertificationCandidateForApp).to.deep.equal({
        data: {
          type: 'certification-candidates',
          id: certificationCandidate.id.toString(),
          attributes: {
            'first-name': 'John',
            'last-name': 'Doe',
            birthdate: '1990-12-25',
            'session-id': 5678,
            'has-seen-certification-instructions': false,
            'complementary-certification-key': 'DROIT',
          },
        },
      });
    });
  });
});
