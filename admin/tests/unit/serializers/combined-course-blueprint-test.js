import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Serializer | combined-course-blueprint', function (hooks) {
  setupTest(hooks);

  test('it serializes records', function (assert) {
    const store = this.owner.lookup('service:store');
    const record = store.createRecord('combined-course-blueprint', {
      name: 'parcours',
      internalName: 'Nom interne',
      content: [
        {
          type: 'evaluation',
          value: 1,
          label: 'Profil cilble 1',
        },
      ],
      attestationLabel: 'Label attestation',
      attestationKey: 'ATTESTATION_KEY',
    });

    const serializedRecord = record.serialize();

    assert.deepEqual(
      {
        data: {
          type: 'combined-course-blueprints',
          attributes: {
            name: 'parcours',
            'internal-name': 'Nom interne',
            'created-at': undefined,
            illustration: null,
            description: null,
            content: [
              {
                type: 'evaluation',
                value: 1,
              },
            ],
            'attestation-label': 'Label attestation',
            'attestation-key': 'ATTESTATION_KEY',
          },
        },
      },
      serializedRecord,
    );
  });
});
