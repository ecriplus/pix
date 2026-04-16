import Service from '@ember/service';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/attestations', function (hooks) {
  setupTest(hooks);

  module('beforeModel', function () {
    test('should redirect to application when currentUser.canAccessAttestationsPage is false', function (assert) {
      // given
      class CurrentUserStub extends Service {
        canAccessAttestationsPage = false;
      }

      this.owner.register('service:current-user', CurrentUserStub);
      const route = this.owner.lookup('route:authenticated.attestations');
      const replaceWithStub = sinon.stub();
      route.router.replaceWith = replaceWithStub;

      // when
      route.beforeModel();

      // then
      sinon.assert.calledOnceWithExactly(replaceWithStub, 'application');
      assert.ok(true);
    });

    test('should not redirect to application when currentUser.canAccessAttestationsPage is true', function (assert) {
      // given
      class CurrentUserStub extends Service {
        canAccessAttestationsPage = true;
      }

      this.owner.register('service:current-user', CurrentUserStub);
      const route = this.owner.lookup('route:authenticated.attestations');
      const replaceWithStub = sinon.stub();
      route.router.replaceWith = replaceWithStub;

      // when
      route.beforeModel();

      // then
      sinon.assert.notCalled(replaceWithStub);
      assert.ok(true);
    });
  });

  module('#model', function () {
    test('it should return a list of options based on organization divisions', async function (assert) {
      // given
      const divisions = [{ name: '3èmeA' }, { name: '2ndE' }];
      const attestationParticipantStatuses = Symbol('expected-attestations');
      const attestations = [{ label: 'attestation 1', key: 'MY_KEY' }];
      class CurrentUserStub extends Service {
        canAccessAttestationsPage = true;
        organization = {
          id: 12345,
          divisions,
          isManagingStudents: true,
        };
      }

      const findRecordStub = sinon.stub();
      const queryStub = sinon.stub();
      const findAllStub = sinon.stub();
      class StoreStub extends Service {
        findRecord = findRecordStub;
        query = queryStub;
        findAll = findAllStub;
      }

      queryStub.resolves(attestationParticipantStatuses);
      findAllStub.resolves(attestations);

      this.owner.register('service:current-user', CurrentUserStub);
      this.owner.register('service:store', StoreStub);

      const route = this.owner.lookup('route:authenticated/attestations');

      // when
      const actualOptions = await route.model({ statuses: [] });

      // then
      assert.deepEqual(actualOptions, {
        attestationParticipantStatuses,
        availableAttestations: attestations,
        currentAttestation: { key: 'MY_KEY', label: 'attestation 1' },
        options: [
          {
            label: '3èmeA',
            value: '3èmeA',
          },
          {
            label: '2ndE',
            value: '2ndE',
          },
        ],
      });
    });

    test('it should return no options if current organization is not managing students', async function (assert) {
      // given
      const divisions = [{ name: '3èmeA' }, { name: '2ndE' }];
      const attestationParticipantStatuses = Symbol('expected-attestations');
      const attestations = [
        { label: 'attestation 1', key: 'MY_KEY' },
        { label: 'attestation 2', key: 'MY_OTHER_KEY' },
      ];

      class CurrentUserStub extends Service {
        canAccessAttestationsPage = true;
        organization = {
          id: 12345,
          divisions,
          isManagingStudents: false,
        };
      }

      const findRecordStub = sinon.stub();
      const queryRecord = sinon.stub();
      const findAllStub = sinon.stub().resolves(attestations);
      class StoreStub extends Service {
        findRecord = findRecordStub;
        query = queryRecord;
        findAll = findAllStub;
      }

      queryRecord.resolves(attestationParticipantStatuses);
      findAllStub.resolves(attestations);

      this.owner.register('service:current-user', CurrentUserStub);
      this.owner.register('service:store', StoreStub);

      const route = this.owner.lookup('route:authenticated/attestations');

      // when
      const actualOptions = await route.model({ statuses: [] });

      // then
      assert.deepEqual(actualOptions, {
        attestationParticipantStatuses,
        availableAttestations: attestations,
        currentAttestation: { key: 'MY_KEY', label: 'attestation 1' },
      });
      assert.notPropContains(actualOptions, {
        options: [
          {
            label: '3èmeA',
            value: '3èmeA',
          },
          {
            label: '2ndE',
            value: '2ndE',
          },
        ],
      });
    });

    test('it should call the store with the first available attestation key', async function (assert) {
      // given
      const divisions = [{ name: '3èmeA' }, { name: '2ndE' }];
      const attestationParticipantStatuses = Symbol('expected-attestations');
      const attestations = [
        { label: 'attestation 1', key: 'MY_KEY' },
        { label: 'attestation 2', key: 'MY_OTHER_KEY' },
      ];
      class CurrentUserStub extends Service {
        canAccessAttestationsPage = true;
        organization = {
          id: 12345,
          divisions,
          isManagingStudents: false,
        };
      }

      const findRecordStub = sinon.stub();
      const queryRecord = sinon.stub();
      const findAllStub = sinon.stub();
      class StoreStub extends Service {
        findRecord = findRecordStub;
        query = queryRecord;
        findAll = findAllStub;
      }

      queryRecord.resolves(attestationParticipantStatuses);
      findAllStub.resolves(attestations);

      this.owner.register('service:current-user', CurrentUserStub);
      this.owner.register('service:store', StoreStub);

      const route = this.owner.lookup('route:authenticated/attestations');

      // when
      await route.model({ statuses: [] });

      // then
      assert.ok(
        queryRecord.calledOnceWithExactly('attestation-participant-status', {
          organizationId: 12345,
          attestationKey: 'MY_KEY',
          filter: {
            statuses: [],
            divisions: undefined,
            search: undefined,
          },
          page: {
            number: undefined,
            size: undefined,
          },
        }),
      );
    });

    test('it should call the attestation-participant-status store with model params in the correct format', async function (assert) {
      // given
      const divisions = [{ name: '3èmeA' }, { name: '2ndE' }];
      const attestationParticipantStatuses = Symbol('expected-attestations');
      const attestations = [
        { label: 'attestation 1', key: 'MY_KEY' },
        { label: 'attestation 2', key: 'MY_OTHER_KEY' },
      ];
      class CurrentUserStub extends Service {
        canAccessAttestationsPage = true;
        organization = {
          id: 12345,
          divisions,
          isManagingStudents: false,
        };
      }

      const findRecordStub = sinon.stub();
      const queryRecord = sinon.stub();
      const findAllStub = sinon.stub();
      class StoreStub extends Service {
        findRecord = findRecordStub;
        query = queryRecord;
        findAll = findAllStub;
      }

      queryRecord.resolves(attestationParticipantStatuses);
      findAllStub.resolves(attestations);

      this.owner.register('service:current-user', CurrentUserStub);
      this.owner.register('service:store', StoreStub);

      const route = this.owner.lookup('route:authenticated/attestations');

      // when
      await route.model({
        attestationKey: 'POUET',
        statuses: ['YES', 'NO', 'CAN YOU REPEAT THE QUESTION'],
        divisions: ['substract', 'multiply'],
        search: 'Maurice',
        pageNumber: 666,
        pageSize: 25,
      });

      // then
      assert.ok(
        queryRecord.calledOnceWithExactly('attestation-participant-status', {
          organizationId: 12345,
          attestationKey: 'POUET',
          filter: {
            statuses: ['YES', 'NO', 'CAN YOU REPEAT THE QUESTION'],
            divisions: ['substract', 'multiply'],
            search: 'Maurice',
          },
          page: {
            number: 666,
            size: 25,
          },
        }),
      );
    });
  });
});
