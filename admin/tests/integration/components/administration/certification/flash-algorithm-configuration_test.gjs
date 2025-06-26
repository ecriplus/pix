import { clickByName, fillByLabel, render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import FlashAlgorithmConfiguration from 'pix-admin/components/administration/certification/flash-algorithm-configuration';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest, { t } from '../../../../helpers/setup-intl-rendering';

module('Integration | Component |  administration/certification/flash-algorithm-configuration', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('should display all details', async function (assert) {
    // given
    const flashAlgorithmConfiguration = {
      maximumAssessmentLength: 1,
      challengesBetweenSameCompetence: 3,
      variationPercent: 4,
      limitToOneQuestionPerTube: true,
      enablePassageByAllCompetences: false,
    };

    // when
    const screen = await render(
      <template><FlashAlgorithmConfiguration @model={{flashAlgorithmConfiguration}} /></template>,
    );

    // then
    const maximumAssessmentLength = await screen.getByRole('spinbutton', {
      name: t('pages.administration.certification.flash-algorithm-configuration.form.maximumAssessmentLength'),
    }).value;
    const challengesBetweenSameCompetence = await screen.getByRole('spinbutton', {
      name: t('pages.administration.certification.flash-algorithm-configuration.form.challengesBetweenSameCompetence'),
    }).value;
    const variationPercent = await screen.getByRole('spinbutton', {
      name: t('pages.administration.certification.flash-algorithm-configuration.form.variationPercent'),
    }).value;
    const limitToOneQuestionPerTube = await screen.getByRole('checkbox', {
      name: t('pages.administration.certification.flash-algorithm-configuration.form.limitToOneQuestionPerTube'),
    }).checked;
    const enablePassageByAllCompetences = await screen.getByRole('checkbox', {
      name: t('pages.administration.certification.flash-algorithm-configuration.form.enablePassageByAllCompetences'),
    }).checked;

    assert.strictEqual(maximumAssessmentLength, '1');
    assert.strictEqual(challengesBetweenSameCompetence, '3');
    assert.strictEqual(variationPercent, '4');
    assert.true(limitToOneQuestionPerTube);
    assert.false(enablePassageByAllCompetences);
  });

  module('Form submission', function () {
    test('should create flash algorithm configuration when form is submitted', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const adapter = store.adapterFor('flash-algorithm-configuration');
      const createRecordStub = sinon.stub(adapter, 'createRecord').resolves();

      const notificationSuccessStub = sinon.stub();
      class NotificationsStub extends Service {
        sendSuccessNotification = notificationSuccessStub;
      }
      this.owner.register('service:pixToast', NotificationsStub);

      const model = {
        maximumAssessmentLength: 0,
        challengesBetweenSameCompetence: 0,
        variationPercent: 0,
        limitToOneQuestionPerTube: false,
        enablePassageByAllCompetences: false,
      };

      // when
      await render(<template><FlashAlgorithmConfiguration @model={{model}} /></template>);

      await fillByLabel(
        t('pages.administration.certification.flash-algorithm-configuration.form.maximumAssessmentLength'),
        '10',
      );
      await fillByLabel(
        t('pages.administration.certification.flash-algorithm-configuration.form.challengesBetweenSameCompetence'),
        '5',
      );
      await fillByLabel(
        t('pages.administration.certification.flash-algorithm-configuration.form.variationPercent'),
        '15',
      );
      await clickByName('Enregistrer');

      // then
      assert.ok(createRecordStub.called);
      const submittedData = createRecordStub.getCall(0).args[0];
      assert.strictEqual(submittedData.maximumAssessmentLength, '10');
      assert.strictEqual(submittedData.challengesBetweenSameCompetence, '5');
      assert.strictEqual(submittedData.variationPercent, '15');
      sinon.assert.calledWith(notificationSuccessStub, { message: 'La configuration a été créée' });
    });

    test('should show error notification when form submission fails', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const adapter = store.adapterFor('flash-algorithm-configuration');
      sinon.stub(adapter, 'createRecord').rejects(new Error('Creation failed'));

      const notificationErrorStub = sinon.stub();
      class NotificationsStub extends Service {
        sendErrorNotification = notificationErrorStub;
      }
      this.owner.register('service:pixToast', NotificationsStub);

      const model = {
        maximumAssessmentLength: 0,
        challengesBetweenSameCompetence: 0,
        variationPercent: 0,
        limitToOneQuestionPerTube: false,
        enablePassageByAllCompetences: false,
      };

      // when
      await render(<template><FlashAlgorithmConfiguration @model={{model}} /></template>);

      await fillByLabel(
        t('pages.administration.certification.flash-algorithm-configuration.form.maximumAssessmentLength'),
        '10',
      );
      await clickByName('Enregistrer');

      // then
      sinon.assert.calledWith(notificationErrorStub, { message: "La configuration n'a pu être créée" });
      assert.ok(true);
    });
  });
});
