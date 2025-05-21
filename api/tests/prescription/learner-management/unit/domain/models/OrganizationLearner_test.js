import range from 'lodash/range.js';

import { OrganizationLearner } from '../../../../../../src/prescription/learner-management/domain/models/OrganizationLearner.js';
import { MINIMUM_CERTIFIABLE_COMPETENCES_FOR_CERTIFIABILITY } from '../../../../../../src/shared/domain/constants.js';
import { PlacementProfile } from '../../../../../../src/shared/domain/models/index.js';
import { domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Unit | Domain | Models | OrganizationLearner', function () {
  describe('#updateCertificability', function () {
    it('should update certificability if certifiable', function () {
      // given
      const certifiableDate = new Date('2023-01-01');
      const organizationLearner = new OrganizationLearner({ isCertifiable: false });
      const userCompetences = range(MINIMUM_CERTIFIABLE_COMPETENCES_FOR_CERTIFIABILITY).map(() =>
        domainBuilder.buildUserCompetence({ estimatedLevel: 1 }),
      );
      const placementProfile = new PlacementProfile({
        userId: organizationLearner.userId,
        profileDate: certifiableDate,
        userCompetences,
      });

      // when
      organizationLearner.updateCertificability(placementProfile);

      //then
      expect(organizationLearner.isCertifiable).to.be.true;
      expect(new Date(organizationLearner.certifiableAt)).to.deep.equal(placementProfile.profileDate);
    });

    it('should update certifiableAt if not certifiable', function () {
      // given
      const profileDate = new Date('2023-01-01');
      const organizationLearner = new OrganizationLearner({ isCertifiable: false });
      const placementProfile = new PlacementProfile({
        userId: organizationLearner.userId,
        profileDate: profileDate,
        userCompetences: [],
      });

      // when
      organizationLearner.updateCertificability(placementProfile);

      //then
      expect(organizationLearner.isCertifiable).to.be.false;
      expect(new Date(organizationLearner.certifiableAt)).to.deep.equal(placementProfile.profileDate);
    });
  });

  describe('#delete', function () {
    let clock;
    let now;

    beforeEach(function () {
      now = new Date('2025-01-01');
      clock = sinon.useFakeTimers(now, 'Date');
    });

    afterEach(function () {
      clock.restore();
    });

    it('should update deteledAt, deletedBy', function () {
      // given
      const userId = 123;
      const organizationLearner = new OrganizationLearner();

      // when
      organizationLearner.delete(userId);

      // then
      expect(organizationLearner.deletedAt).to.deep.equal(now);
      expect(organizationLearner.deletedBy).to.equal(userId);
    });
  });
});
