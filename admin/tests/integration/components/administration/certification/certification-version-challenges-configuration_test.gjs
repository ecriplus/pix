import { clickByName, fillByLabel, render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import CertificationVersionChallengesConfiguration from 'pix-admin/components/administration/certification/certification-version-challenges-configuration';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest, { t } from '../../../../helpers/setup-intl-rendering';

module(
  'Integration | Component |  administration/certification/certification-version-challenges-configuration',
  function (hooks) {
    setupIntlRenderingTest(hooks);

    test('should display all details', async function (assert) {
      const store = this.owner.lookup('service:store');
      const certificationVersion = store.createRecord('certification-version', {
        id: '123',
        scope: 'CORE',
        challengesConfiguration: {
          maximumAssessmentLength: 1,
          challengesBetweenSameCompetence: 3,
          variationPercent: 0.4,
          limitToOneQuestionPerTube: true,
          enablePassageByAllCompetences: false,
        },
      });

      const screen = await render(
        <template><CertificationVersionChallengesConfiguration @model={{certificationVersion}} /></template>,
      );

      const maximumAssessmentLength = await screen.getByRole('spinbutton', {
        name: t(
          'pages.administration.certification.certification-version-challenges-configuration.form.maximumAssessmentLength',
        ),
      }).value;
      const challengesBetweenSameCompetence = await screen.getByRole('spinbutton', {
        name: t(
          'pages.administration.certification.certification-version-challenges-configuration.form.challengesBetweenSameCompetence',
        ),
      }).value;
      const variationPercent = await screen.getByRole('spinbutton', {
        name: t(
          'pages.administration.certification.certification-version-challenges-configuration.form.variationPercent',
        ),
      }).value;
      const limitToOneQuestionPerTube = await screen.getByRole('checkbox', {
        name: t(
          'pages.administration.certification.certification-version-challenges-configuration.form.limitToOneQuestionPerTube',
        ),
      }).checked;
      const enablePassageByAllCompetences = await screen.getByRole('checkbox', {
        name: t(
          'pages.administration.certification.certification-version-challenges-configuration.form.enablePassageByAllCompetences',
        ),
      }).checked;

      assert.strictEqual(maximumAssessmentLength, '1');
      assert.strictEqual(challengesBetweenSameCompetence, '3');
      assert.strictEqual(variationPercent, '40');
      assert.true(limitToOneQuestionPerTube);
      assert.false(enablePassageByAllCompetences);
    });

    module('Form submission', function () {
      test('should update certification version when form is submitted', async function (assert) {
        const store = this.owner.lookup('service:store');
        const certificationVersion = store.createRecord('certification-version', {
          id: '123',
          scope: 'CORE',
          challengesConfiguration: {
            maximumAssessmentLength: 0,
            challengesBetweenSameCompetence: 0,
            variationPercent: 0,
            limitToOneQuestionPerTube: false,
            enablePassageByAllCompetences: false,
          },
        });
        const saveStub = sinon.stub(certificationVersion, 'save').resolves();

        const notificationSuccessStub = sinon.stub();
        class NotificationsStub extends Service {
          sendSuccessNotification = notificationSuccessStub;
        }
        this.owner.register('service:pixToast', NotificationsStub);

        await render(
          <template><CertificationVersionChallengesConfiguration @model={{certificationVersion}} /></template>,
        );

        await fillByLabel(
          t(
            'pages.administration.certification.certification-version-challenges-configuration.form.maximumAssessmentLength',
          ),
          10,
        );
        await fillByLabel(
          t(
            'pages.administration.certification.certification-version-challenges-configuration.form.challengesBetweenSameCompetence',
          ),
          5,
        );
        await fillByLabel(
          t('pages.administration.certification.certification-version-challenges-configuration.form.variationPercent'),
          15,
        );
        await clickByName('Enregistrer');

        assert.ok(saveStub.called);
        assert.strictEqual(certificationVersion.challengesConfiguration.maximumAssessmentLength, '10');
        assert.strictEqual(certificationVersion.challengesConfiguration.challengesBetweenSameCompetence, '5');
        assert.strictEqual(certificationVersion.challengesConfiguration.variationPercent, 0.15);
        sinon.assert.calledWith(notificationSuccessStub, { message: 'La configuration a été mise à jour' });
      });

      test('should show error notification when form submission fails', async function (assert) {
        const store = this.owner.lookup('service:store');
        const certificationVersion = store.createRecord('certification-version', {
          id: '123',
          scope: 'CORE',
          challengesConfiguration: {
            maximumAssessmentLength: 0,
            challengesBetweenSameCompetence: 0,
            variationPercent: 0,
            limitToOneQuestionPerTube: false,
            enablePassageByAllCompetences: false,
          },
        });
        sinon.stub(certificationVersion, 'save').rejects(new Error('Update failed'));

        const notificationErrorStub = sinon.stub();
        class NotificationsStub extends Service {
          sendErrorNotification = notificationErrorStub;
        }
        this.owner.register('service:pixToast', NotificationsStub);

        await render(
          <template><CertificationVersionChallengesConfiguration @model={{certificationVersion}} /></template>,
        );

        await fillByLabel(
          t(
            'pages.administration.certification.certification-version-challenges-configuration.form.maximumAssessmentLength',
          ),
          10,
        );
        await clickByName('Enregistrer');

        sinon.assert.calledWith(notificationErrorStub, { message: "La configuration n'a pu être mise à jour" });
        assert.ok(true);
      });
    });
  },
);
