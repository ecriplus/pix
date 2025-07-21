import { assert } from 'chai';

import { EntityValidationError } from '../../../../../../src/shared/domain/errors.js';
import { EventLoggingJob } from '../../../../../../src/shared/domain/models/jobs/EventLoggingJob.js';
import { expect, sinon } from '../../../../../test-helper.js';

describe('Unit | Shared | Domain | Model | Jobs | EventLoggingJob', function () {
  const now = new Date(2024, 1, 1);
  let clock;

  beforeEach(function () {
    clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
  });

  afterEach(function () {
    clock.restore();
  });

  describe('EventLoggingJob.forUser', function () {
    it('creates an EventLoggingJob instance for a user', async function () {
      // when
      const eventLoggingJob = EventLoggingJob.forUser({
        client: 'PIX_APP',
        action: 'EMAIL_CHANGED',
        role: 'USER',
        userId: 456,
        updatedByUserId: 123,
        data: { foo: 'bar' },
        occurredAt: new Date(),
      });

      // then
      expect(eventLoggingJob.client).to.equal('PIX_APP');
      expect(eventLoggingJob.action).to.equal('EMAIL_CHANGED');
      expect(eventLoggingJob.role).to.equal('USER');
      expect(eventLoggingJob.userId).to.equal(123);
      expect(eventLoggingJob.targetUserIds).to.deep.equal([456]);
      expect(eventLoggingJob.data).to.deep.equal({ foo: 'bar' });
      expect(eventLoggingJob.occurredAt).to.deep.equal(now);
    });
  });

  describe('EventLoggingJob.forUsers', function () {
    it('creates an EventLoggingJob instance for multiple users', async function () {
      // when
      const eventLoggingJob = EventLoggingJob.forUsers({
        client: 'PIX_APP',
        action: 'EMAIL_CHANGED',
        role: 'USER',
        userIds: [456, 789],
        updatedByUserId: 123,
        data: { foo: 'bar' },
        occurredAt: new Date(),
      });

      // then
      expect(eventLoggingJob.client).to.equal('PIX_APP');
      expect(eventLoggingJob.action).to.equal('EMAIL_CHANGED');
      expect(eventLoggingJob.role).to.equal('USER');
      expect(eventLoggingJob.userId).to.equal(123);
      expect(eventLoggingJob.targetUserIds).to.deep.equal([456, 789]);
      expect(eventLoggingJob.data).to.deep.equal({ foo: 'bar' });
      expect(eventLoggingJob.occurredAt).to.deep.equal(now);
    });
  });

  describe('default values and errors', function () {
    context('when occurredAt is not defined', function () {
      it('set a default date for occurredAt', function () {
        // when
        const eventLoggingJob = EventLoggingJob.forUser({
          client: 'PIX_APP',
          action: 'EMAIL_CHANGED',
          role: 'USER',
          userId: 456,
          updatedByUserId: 123,
        });

        // then
        expect(eventLoggingJob.occurredAt).to.deep.equal(now);
      });
    });

    context('when required fields are missing', function () {
      it('throws an entity validation error', function () {
        try {
          // when
          EventLoggingJob.forUser({});
          assert.fail();
        } catch (error) {
          // then
          expect(error).to.be.instanceOf(EntityValidationError);
          expect(error.invalidAttributes).to.deep.equal([
            { attribute: 'client', message: '"client" is required' },
            { attribute: 'action', message: '"action" is required' },
            { attribute: 'role', message: '"role" is required' },
            { attribute: 'userId', message: '"userId" is required' },
            { attribute: 'targetUserIds', message: '"targetUserIds" must contain at least 1 items' },
          ]);
        }
      });
    });
  });
});
