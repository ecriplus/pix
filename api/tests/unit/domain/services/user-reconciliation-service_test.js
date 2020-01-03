const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
const userReconciliationService = require('../../../../lib/domain/services/user-reconciliation-service');
const { NotFoundError } = require('../../../../lib/domain/errors');

describe('Unit | Service | user-reconciliation-service', () => {

  let students;
  let user;

  describe('#findMatchingCandidateIdForGivenUser', () => {
    beforeEach(() => {
      students = [
        domainBuilder.buildStudent(),
        domainBuilder.buildStudent(),
      ];
      user = {
        firstName: 'Joe',
        lastName: 'Poe',
      };
    });

    afterEach(() => {
      sinon.restore();
    });

    context('When student list is not empty', () => {

      context('When no student matched on names', () => {

        it('should return null if name is completely different', async () => {
          // given
          user.firstName = 'Sam';

          students[0].firstName = 'Joe';
          students[0].lastName = user.lastName;

          // when
          const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(students, user);

          // then
          expect(result).to.equal(null);
        });

        it('should return null if name is not close enough', async () => {
          // given
          user.firstName = 'Frédérique';

          students[0].firstName = 'Frédéric';
          students[0].lastName = user.lastName;

          // when
          const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(students, user);

          // then
          expect(result).to.equal(null);
        });

      });

      context('When one student matched on names', () => {

        context('When student found based on his...', () => {

          it('...firstName', async () => {
            // given
            students[0].firstName = user.firstName;
            students[0].lastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(students, user);

            // then
            expect(result).to.equal(students[0].id);
          });

          it('...middleName', async () => {
            // given
            students[0].middleName = user.firstName;
            students[0].lastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(students, user);

            // then
            expect(result).to.equal(students[0].id);
          });

          it('...thirdName', async () => {
            // given
            students[0].thirdName = user.firstName;
            students[0].lastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(students, user);

            // then
            expect(result).to.equal(students[0].id);
          });

          it('...lastName', async () => {
            // given
            students[0].firstName = user.firstName;
            students[0].lastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(students, user);

            // then
            expect(result).to.equal(students[0].id);
          });

          it('...preferredLastName', async () => {
            // given
            students[0].firstName = user.firstName;
            students[0].preferredLastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(students, user);

            // then
            expect(result).to.equal(students[0].id);
          });

          it('...firstName with empty middleName', async () => {
            // given
            students[0].firstName = user.firstName;
            students[0].middleName = null;
            students[0].lastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(students, user);

            // then
            expect(result).to.equal(students[0].id);
          });

          it('...preferredLastName with empty lastName', async () => {
            // given
            students[0].firstName = user.firstName;
            students[0].preferredLastName = user.lastName;
            students[0].lastName = null;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(students, user);

            // then
            expect(result).to.equal(students[0].id);
          });

          it('...lastName with empty preferredLastName', async () => {
            // given
            students[0].firstName = user.firstName;
            students[0].preferredLastName = null;
            students[0].lastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(students, user);

            // then
            expect(result).to.equal(students[0].id);
          });
        });

        context('When student found even if there is...', () => {

          it('...an accent', async () => {
            // given
            user.firstName = 'Joé';

            students[0].firstName = 'Joe';
            students[0].lastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(students, user);

            // then
            expect(result).to.equal(students[0].id);
          });

          it('...a white space', async () => {
            // given
            user.firstName = 'Jo e';

            students[0].firstName = 'Joe';
            students[0].lastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(students, user);

            // then
            expect(result).to.equal(students[0].id);
          });

          it('...a special character', async () => {
            // given
            user.firstName = 'Jo~e';

            students[0].firstName = 'Joe';
            students[0].lastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(students, user);

            // then
            expect(result).to.equal(students[0].id);
          });
        });

        context('When multiple matches', () => {

          it('should prefer firstName over middleName', async () => {
            // given
            students[0].middleName = user.firstName;
            students[0].lastName = user.lastName;

            students[1].firstName = user.firstName;
            students[1].lastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(students, user);

            // then
            expect(result).to.equal(students[1].id);
          });

          it('should prefer middleName over thirdName', async () => {
            // given
            students[0].thirdName = user.firstName;
            students[0].lastName = user.lastName;

            students[1].middleName = user.firstName;
            students[1].lastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(students, user);

            // then
            expect(result).to.equal(students[1].id);
          });

          it('should prefer nobody with same lastName and preferredLastName', async () => {
            // given
            students[0].firstName = user.firstName;
            students[0].lastName = user.lastName;

            students[1].firstName = user.firstName;
            students[1].preferredLastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(students, user);

            // then
            expect(result).to.equal(null);
          });
        });
      });
    });
  });

  describe('#findMatchingOrganizationStudentIdForGivenUser', () => {
    let organizationId;
    let studentRepositoryStub;

    beforeEach(() => {
      students = [
        domainBuilder.buildStudent(),
        domainBuilder.buildStudent(),
      ];
      organizationId = domainBuilder.buildOrganization().id;
      studentRepositoryStub = { findNotLinkedYetByOrganizationIdAndUserBirthdate: sinon.stub() };
    });

    afterEach(() => {
      sinon.restore();
    });

    context('When student list is not empty', () => {

      beforeEach(() => {
        studentRepositoryStub.findNotLinkedYetByOrganizationIdAndUserBirthdate.resolves(students);
      });

      context('When no student matched on names', () => {

        it('should throw NotFoundError', async () => {
          // given
          user = {
            firstName: 'fakeFirstName',
            lastName: 'fakeLastName',
          };

          // when
          const result = await catchErr(userReconciliationService.findMatchingOrganizationStudentIdForGivenUser)({ organizationId, user, studentRepository: studentRepositoryStub });

          // then
          expect(result).to.be.instanceOf(NotFoundError, 'There were not exactly one student match for this user and organization');
        });

      });

      context('When one student matched on names', () => {

        it('should return studentId', async () => {
          // given
          user = {
            firstName: students[0].firstName,
            lastName: students[0].lastName,
          };

          // when
          const result = await userReconciliationService.findMatchingOrganizationStudentIdForGivenUser({ organizationId, user, studentRepository: studentRepositoryStub });

          // then
          expect(result).to.equal(students[0].id);
        });

      });
    });

    context('When student list is empty', () => {

      beforeEach(() => {
        studentRepositoryStub.findNotLinkedYetByOrganizationIdAndUserBirthdate.resolves([]);
      });

      it('should throw NotFoundError', async () => {
        // given
        user = {
          firstName: 'fakeFirstName',
          lastName: 'fakeLastName',
        };

        // when
        const result = await catchErr(userReconciliationService.findMatchingOrganizationStudentIdForGivenUser)({ organizationId, user, studentRepository: studentRepositoryStub });

        // then
        expect(result).to.be.instanceOf(NotFoundError, 'There were no students matching');
      });

    });
  });

});
