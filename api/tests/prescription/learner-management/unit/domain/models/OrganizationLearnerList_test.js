import { CouldNotDeleteLearnersError } from '../../../../../../src/prescription/learner-management/domain/errors.js';
import { OrganizationLearnerList } from '../../../../../../src/prescription/learner-management/domain/models/OrganizationLearnerList.js';
import { logger } from '../../../../../../src/shared/infrastructure/utils/logger.js';
import { catchErrSync, expect, sinon } from '../../../../../test-helper.js';

describe('Unit | Models | OrganizationLearnerListFormat', function () {
  describe('#constructor', function () {
    it('should initialize valid object', function () {
      //when
      const payload = {
        organizationId: Symbol('organizationId'),
        organizationLearners: Symbol('organizationLearnerList'),
      };
      const organizationLearnerList = new OrganizationLearnerList(payload);
      // then
      expect(organizationLearnerList).to.deep.equal(payload);
    });
  });

  describe('#can delete organization learners ', function () {
    it('should throw when lists are different', function () {
      sinon.stub(logger, 'error');
      //when
      const payload = {
        organizationId: 777,
        organizationLearners: [{ id: 123 }, { id: 345 }],
      };

      const organizationLearnerList = new OrganizationLearnerList(payload);

      const result = catchErrSync(organizationLearnerList.canDeleteOrganizationLearners, organizationLearnerList)(
        [456, 123],
        'userIdSample',
      );

      expect(result).to.be.instanceof(CouldNotDeleteLearnersError);
      expect(
        logger.error.calledWithExactly(
          `User id userIdSample could not delete organization learners because learner id 345 don't belong to organization id 777`,
        ),
      );
    });

    it('should not throw when given ids belongs to list', function () {
      const userId = Symbol('123');

      const payload = {
        organizationId: Symbol('organizationId'),
        organizationLearners: [{ id: 123 }, { id: 345 }, { id: 567 }],
      };

      expect(() => {
        const organizationLearnerList = new OrganizationLearnerList(payload);
        organizationLearnerList.canDeleteOrganizationLearners([123, 345], userId);
      }).to.not.throw();
    });
  });

  describe('#getDeletableOrganizationLearners', function () {
    context('when all given organizationLearnerIds are not from organization', function () {
      it('should return an empty array', function () {
        // given
        const payload = {
          organizationId: 777,
          organizationLearners: [{ id: 123 }, { id: 345 }],
        };

        const organizationLearnerList = new OrganizationLearnerList(payload);

        // when
        const result = organizationLearnerList.getDeletableOrganizationLearners([789]);

        // then
        expect(result).to.be.empty;
      });
    });

    context('when some organizationLearnerIds belong to organization', function () {
      it('should return only learner in organization', function () {
        // given
        const payload = {
          organizationId: 777,
          organizationLearners: [{ id: 123 }, { id: 345 }],
        };

        const organizationLearnerList = new OrganizationLearnerList(payload);

        // when
        const result = organizationLearnerList.getDeletableOrganizationLearners([123, 789]);

        // then
        expect(result).to.be.deep.equal([123]);
      });
    });
  });
});
