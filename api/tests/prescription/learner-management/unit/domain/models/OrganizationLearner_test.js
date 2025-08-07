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
      it('should only update updatedAt, deteledAt, deletedBy', function () {
        // given
        const adminUserId = 123;
        const organizationLearner = domainBuilder.buildOrganizationLearner({
          birthdate: '2005-10-03',
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
        expect(organizationLearner.birthdate).to.equal(organizationLearner.birthdate);
        expect(organizationLearner.preferredLastName).to.equal(organizationLearner.preferredLastName);
        expect(organizationLearner.middleName).to.equal(organizationLearner.middleName);
        expect(organizationLearner.thirdName).to.equal(organizationLearner.thirdName);
        expect(organizationLearner.birthCity).to.equal(organizationLearner.birthCity);
        expect(organizationLearner.birthCityCode).to.equal(organizationLearner.birthCityCode);
        expect(organizationLearner.birthProvinceCode).to.equal(organizationLearner.birthProvinceCode);
        expect(organizationLearner.birthCountryCode).to.equal(organizationLearner.birthCountryCode);
        expect(organizationLearner.status).to.equal(organizationLearner.status);
        expect(organizationLearner.MEFCode).to.equal(organizationLearner.MEFCode);
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

    context('when withAnonymisation is true', function () {
      it('should update updatedAt, deteledAt, deletedBy and anonymised fields', function () {
        // given
        const adminUserId = 123;
        const organizationLearner = domainBuilder.buildOrganizationLearner({
          birthdate: '2005-10-03',
          userId: 456,
          deletedAt: null,
          deletedBy: null,
        });

        // when
        organizationLearner.delete(adminUserId, true);

        // then
        expect(organizationLearner.MEFCode).to.equal(organizationLearner.MEFCode);
        expect(organizationLearner.createdAt).to.deep.equal(organizationLearner.createdAt);
        expect(organizationLearner.isDisabled).to.be.equal(organizationLearner.isDisabled);
        expect(organizationLearner.firstName).to.equal('(anonymized)');
        expect(organizationLearner.lastName).to.equal('(anonymized)');
        expect(organizationLearner.birthdate).to.equal('2005-01-01');
        expect(organizationLearner.deletedAt).to.deep.equal(now);
        expect(organizationLearner.deletedBy).to.equal(adminUserId);
        expect(organizationLearner.updatedAt).to.deep.equal(now);
        expect(organizationLearner.userId).to.be.null;
        expect(organizationLearner.preferredLastName).to.be.null;
        expect(organizationLearner.middleName).to.be.null;
        expect(organizationLearner.thirdName).to.be.null;
        expect(organizationLearner.birthCity).to.be.null;
        expect(organizationLearner.birthCityCode).to.be.null;
        expect(organizationLearner.birthProvinceCode).to.be.null;
        expect(organizationLearner.birthCountryCode).to.be.null;
        expect(organizationLearner.status).to.be.null;
        expect(organizationLearner.nationalStudentId).to.be.null;
        expect(organizationLearner.nationalApprenticeId).to.be.null;
        expect(organizationLearner.division).to.be.null;
        expect(organizationLearner.sex).to.be.null;
        expect(organizationLearner.email).to.be.null;
        expect(organizationLearner.studentNumber).to.be.null;
        expect(organizationLearner.department).to.be.null;
        expect(organizationLearner.educationalTeam).to.be.null;
        expect(organizationLearner.group).to.be.null;
        expect(organizationLearner.diploma).to.be.null;
      });
    });
  });

  describe('#dataToUpdateOnDeletion', function () {
    it('should return only data to update on deletion', function () {
      // given
      const organizationLearner = domainBuilder.buildOrganizationLearner({
        birthdate: '2005-10-03',
        userId: 456,
        deletedAt: null,
        deletedBy: null,
      });

      //when && then
      expect(organizationLearner.dataToUpdateOnDeletion).deep.equal({
        id: organizationLearner.id,
        firstName: organizationLearner.firstName,
        lastName: organizationLearner.lastName,
        preferredLastName: organizationLearner.preferredLastName,
        middleName: organizationLearner.middleName,
        thirdName: organizationLearner.thirdName,
        birthdate: organizationLearner.birthdate,
        birthCity: organizationLearner.birthCity,
        birthCityCode: organizationLearner.birthCityCode,
        birthProvinceCode: organizationLearner.birthProvinceCode,
        birthCountryCode: organizationLearner.birthCountryCode,
        status: organizationLearner.status,
        nationalStudentId: organizationLearner.nationalStudentId,
        nationalApprenticeId: organizationLearner.nationalApprenticeId,
        division: organizationLearner.division,
        sex: organizationLearner.sex,
        email: organizationLearner.email,
        studentNumber: organizationLearner.studentNumber,
        department: organizationLearner.department,
        educationalTeam: organizationLearner.educationalTeam,
        group: organizationLearner.group,
        diploma: organizationLearner.diploma,
        userId: organizationLearner.userId,
        isDisabled: organizationLearner.isDisabled,
        updatedAt: organizationLearner.updatedAt,
        deletedAt: organizationLearner.deletedAt,
        deletedBy: organizationLearner.deletedBy,
      });
    });
  });

  describe('#detachUser', function () {
    let clock;
    let now;

    beforeEach(function () {
      now = new Date('2025-01-01');
      clock = sinon.useFakeTimers(now, 'Date');
    });

    afterEach(function () {
      clock.restore();
    });

    it('should detach userId', function () {
      const organizationLearner = domainBuilder.buildOrganizationLearner({
        userId: 456,
      });
      organizationLearner.detachUser();
      expect(organizationLearner.userId).null;
      expect(organizationLearner.updatedAt).deep.equal(now);
    });
  });

  describe('#updateName', function () {
    it('should update first and last name', function () {
      const organizationLearner = domainBuilder.buildOrganizationLearner({
        firstName: 'Hippopotamus',
        lastName: 'nivea',
      });

      organizationLearner.updateName('Spilogale', 'Americanum');
      expect(organizationLearner.firstName).deep.equal('Spilogale');
      expect(organizationLearner.lastName).deep.equal('Americanum');
    });
  });
});
