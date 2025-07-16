import { UserModuleStatus } from '../../../../../../src/devcomp/domain/models/module/UserModuleStatus.js';
import { Passage } from '../../../../../../src/devcomp/domain/models/Passage.js';
import { DomainError } from '../../../../../../src/shared/domain/errors.js';
import { catchErrSync, expect } from '../../../../../test-helper.js';

describe('Unit | Devcomp | Domain | Models | Module | UserModuleStatus', function () {
  let userId, moduleId, passages;
  let now;

  beforeEach(function () {
    userId = '1';
    moduleId = '66f6dea7-1bb3-4ec2-b33d-1c5e7bde3675';
    now = new Date('2025-07-02T14:00:00Z');
    passages = [
      new Passage({
        id: 1,
        moduleId,
        userId,
        createdAt: now,
        updatedAt: now,
        terminatedAt: now,
      }),
    ];
  });

  it('should init and keep attributes', function () {
    // when
    const userModuleStatus = new UserModuleStatus({ userId, moduleId, passages });

    // then
    expect(userModuleStatus.moduleId).to.equal(moduleId);
    expect(userModuleStatus.passages).to.deep.equal(passages);
    expect(userModuleStatus.userId).to.equal(userId);
    expect(userModuleStatus.status).to.equal('COMPLETED');
  });

  describe('if userId passed is not defined', function () {
    it('should throw an error', function () {
      // when
      const error = catchErrSync(
        () =>
          new UserModuleStatus({
            moduleId,
            passages,
          }),
      )();

      // then
      expect(error).to.be.instanceOf(DomainError);
      expect(error.message).to.equal('The userId is required for a UserModuleStatus');
    });
  });

  describe('if moduleId passed is not defined', function () {
    it('should throw an error', function () {
      // when
      const error = catchErrSync(
        () =>
          new UserModuleStatus({
            userId,
            passages,
          }),
      )();

      // then
      expect(error).to.be.instanceOf(DomainError);
      expect(error.message).to.equal('The moduleId is required for a UserModuleStatus');
    });
  });

  describe('if passages passed is not defined', function () {
    it('should throw an error', function () {
      // when
      const error = catchErrSync(
        () =>
          new UserModuleStatus({
            userId,
            moduleId,
          }),
      )();

      // then
      expect(error).to.be.instanceOf(DomainError);
      expect(error.message).to.equal('The passages field is required for a UserModuleStatus');
    });
  });

  describe('if passages passed do not match userId and moduleId of class attributes', function () {
    it('should throw an error', function () {
      // given
      const otherUserId = 'otherUserId';
      const otherModuleId = 'otherModuleId';
      passages = [
        ...passages,
        new Passage({
          id: 2,
          moduleId: otherModuleId,
          userId: otherUserId,
          createdAt: now,
          updatedAt: now,
          terminatedAt: now,
        }),
      ];

      // when
      const error = catchErrSync(
        () =>
          new UserModuleStatus({
            userId,
            moduleId,
            passages,
          }),
      )();

      // then
      expect(error).to.be.instanceOf(DomainError);
      expect(error.message).to.equal('Module and user id of passages must be the same as UserModuleStatus attributes');
    });
  });

  describe('#computeStatus', function () {
    context('when passages is empty', function () {
      it('should return "NOT_STARTED"', function () {
        // given
        passages = [];
        const userModuleStatus = new UserModuleStatus({ userId, moduleId, passages });

        // when
        const status = userModuleStatus.computeStatus();

        // then
        expect(status).to.equal('NOT_STARTED');
      });
    });

    describe('when passages passed are not empty', function () {
      context('when the most recent passage does not have a terminatedAt attribute', function () {
        it('should return IN_PROGRESS', function () {
          // given
          const nowMinusOneHour = new Date(now.getTime() - 3600);
          passages = [
            new Passage({
              id: 1,
              moduleId,
              userId,
              createdAt: nowMinusOneHour,
              updatedAt: nowMinusOneHour,
              terminatedAt: nowMinusOneHour,
            }),
            new Passage({
              id: 2,
              moduleId,
              userId,
              createdAt: now,
              updatedAt: now,
              terminatedAt: null,
            }),
          ];
          const userModuleStatus = new UserModuleStatus({ userId, moduleId, passages });

          // when
          const status = userModuleStatus.computeStatus();

          // then
          expect(status).to.equal('IN_PROGRESS');
        });
      });
      context('when the most recent passage has a terminatedAt attribute', function () {
        it('should set the status attribute to COMPLETED', function () {
          // given
          const nowMinusOneHour = new Date(now.getTime() - 3600);
          passages = [
            new Passage({
              id: 1,
              moduleId,
              userId,
              createdAt: nowMinusOneHour,
              updatedAt: nowMinusOneHour,
              terminatedAt: nowMinusOneHour,
            }),
            new Passage({
              id: 2,
              moduleId,
              userId,
              createdAt: now,
              updatedAt: now,
              terminatedAt: now,
            }),
          ];
          const userModuleStatus = new UserModuleStatus({ userId, moduleId, passages });

          // when
          const status = userModuleStatus.computeStatus();

          // then
          expect(status).to.equal('COMPLETED');
        });
      });
    });
  });
});
