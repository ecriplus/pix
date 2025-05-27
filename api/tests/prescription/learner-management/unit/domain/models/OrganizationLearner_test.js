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

    context('when withAnonymisation is false', function () {
      it('should update deteledAt, deletedBy', function () {
        // given
        const adminUserId = 123;
        const organizationLearner = domainBuilder.buildOrganizationLearner({
          birthdate: new Date('2005-10-03'),
          userId: 456,
          deletedAt: null,
          deletedBy: null,
        });

        // when
        organizationLearner.delete(adminUserId, false);

        // then
        expect(organizationLearner.updatedAt).to.deep.equal(now);
        expect(organizationLearner.deletedAt).to.deep.equal(now);
        expect(organizationLearner.deletedBy).to.equal(adminUserId);
        expect(organizationLearner.userId).to.equal(organizationLearner.userId);
        expect(organizationLearner.firstName).to.equal(organizationLearner.firstName);
        expect(organizationLearner.lastName).to.equal(organizationLearner.lastName);
        expect(organizationLearner.birthDate).to.equal(organizationLearner.birthDate);
        expect(organizationLearner.preferredLastName).to.equal(organizationLearner.preferredLastName);
        expect(organizationLearner.middleName).to.equal(organizationLearner.middleName);
        expect(organizationLearner.thirdName).to.equal(organizationLearner.thirdName);
        expect(organizationLearner.birthCity).to.equal(organizationLearner.birthCity);
        expect(organizationLearner.birthCityCode).to.equal(organizationLearner.birthCityCode);
        expect(organizationLearner.birthProvinceCode).to.equal(organizationLearner.birthProvinceCode);
        expect(organizationLearner.birthCountryCode).to.equal(organizationLearner.birthCountryCode);
        expect(organizationLearner.status).to.equal(organizationLearner.status);
        expect(organizationLearner.nationalStudentId).to.equal(organizationLearner.nationalStudentId);
        expect(organizationLearner.division).to.equal(organizationLearner.division);
        expect(organizationLearner.sex).to.equal(organizationLearner.sex);
        expect(organizationLearner.email).to.equal(organizationLearner.email);
        expect(organizationLearner.studentNumber).to.equal(organizationLearner.studentNumber);
        expect(organizationLearner.department).to.equal(organizationLearner.department);
        expect(organizationLearner.educationalTeam).to.equal(organizationLearner.educationalTeam);
        expect(organizationLearner.group).to.equal(organizationLearner.group);
        expect(organizationLearner.diploma).to.equal(organizationLearner.diploma);
        expect(organizationLearner.nationalApprenticeId).to.equal(organizationLearner.nationalApprenticeId);
      });
    });
  });
});
