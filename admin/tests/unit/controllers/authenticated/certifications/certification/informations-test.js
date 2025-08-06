import EmberObject from '@ember/object';
import Service from '@ember/service';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntl from '../../../../../helpers/setup-intl';

module('Unit | Controller | authenticated/certifications/certification/informations', function (hooks) {
  setupTest(hooks);
  setupIntl(hooks);

  const createCompetence = (code, score, level) => {
    return {
      competence_code: code,
      score: score,
      level: level,
    };
  };

  const aNewCompetenceCode = '4.2';
  const anExistingCompetenceCode = '1.1';
  const anExistingCompetenceWithNoScoreCode = '1.2';
  const anExistingCompetenceWithNoLevelCode = '1.3';
  const anotherExistingCompetenceCode = '5.2';

  const competencesWithMark = [
    createCompetence(anExistingCompetenceCode, 24, 3),
    createCompetence(anExistingCompetenceWithNoScoreCode, null, 5),
    createCompetence(anExistingCompetenceWithNoLevelCode, 40, null),
    createCompetence(anotherExistingCompetenceCode, 33, 4),
  ];

  let controller;

  hooks.beforeEach(function () {
    const store = this.owner.lookup('service:store');
    controller = this.owner.lookup('controller:authenticated/certifications/certification/informations');
    controller.model = {
      certification: store.createRecord('certification', {
        competencesWithMark,
      }),
    };
  });

  module('#shouldDisplayJuryLevelEditButton', function () {
    module('when isExternalResultEditable is true', function () {
      test('it should return true', function (assert) {
        // given
        const store = this.owner.lookup('service:store');
        const complementaryCertificationCourseResultWithExternal = store.createRecord(
          'complementary-certification-course-result-with-external',
        );

        sinon.stub(complementaryCertificationCourseResultWithExternal, 'isExternalResultEditable').get(() => true);

        const certification = store.createRecord('certification', {
          complementaryCertificationCourseResultWithExternal,
        });

        controller.model = {
          certification,
        };
        // when
        const shouldDisplayJuryLevelEditButton = controller.shouldDisplayJuryLevelEditButton;

        // then
        assert.ok(shouldDisplayJuryLevelEditButton);
      });
    });

    module('when isExternalResultEditable is false', function () {
      test('it should return false', function (assert) {
        // given
        const store = this.owner.lookup('service:store');
        const complementaryCertificationCourseResultWithExternal = store.createRecord(
          'complementary-certification-course-result-with-external',
        );

        sinon.stub(complementaryCertificationCourseResultWithExternal, 'isExternalResultEditable').get(() => false);

        const certification = store.createRecord('certification', {
          complementaryCertificationCourseResultWithExternal,
        });

        controller.model = {
          certification,
        };

        // when
        const shouldDisplayJuryLevelEditButton = controller.shouldDisplayJuryLevelEditButton;

        // then
        assert.false(shouldDisplayJuryLevelEditButton);
      });
    });
  });

  module('#juryLevelOptions', function () {
    test('should return an array of labels and values', function (assert) {
      // given
      const complementaryCertificationCourseResultWithExternal = EmberObject.create({
        allowedExternalLevels: [
          {
            value: 'COMME',
            label: 'je veux',
          },
        ],
        defaultJuryOptions: ['REJECTED', 'UNSET'],
      });
      controller.model = {
        certification: EmberObject.create({
          status: 'cancelled',
          complementaryCertificationCourseResultWithExternal,
        }),
      };

      // when
      const juryLevelOptions = controller.juryLevelOptions;

      //then
      assert.deepEqual(juryLevelOptions, [
        {
          value: 'COMME',
          label: 'je veux',
        },
        { value: 'REJECTED', label: 'Rejetée' },
        { value: 'UNSET', label: 'En attente' },
      ]);
    });
  });

  module('#onUpdateScore', () => {
    module('when there is a given score', function () {
      test('it replaces competence score correctly', async function (assert) {
        // When
        await controller.onUpdateScore(anExistingCompetenceCode, '55');

        // then
        const competences = controller.certification.competencesWithMark;
        const aCompetence = _getCompetenceWithMark(anExistingCompetenceCode, competences);

        assert.strictEqual(aCompetence.score, 55);
      });
    });

    module('when there is no given score and competence has no level', function () {
      test('it removes competence correctly (score)', async function (assert) {
        // When
        await controller.onUpdateScore(anExistingCompetenceWithNoLevelCode, '');

        // then
        const competences = controller.certification.competencesWithMark;
        const aCompetence = _getCompetenceWithMark(anExistingCompetenceWithNoLevelCode, competences);

        assert.notOk(aCompetence);
      });
    });

    module('when the competence is not present', function () {
      test('it creates competence score correctly', async function (assert) {
        // When
        await controller.onUpdateScore(aNewCompetenceCode, '55');

        // then
        const competences = controller.certification.competencesWithMark;
        const aCompetence = _getCompetenceWithMark(aNewCompetenceCode, competences);

        assert.strictEqual(aCompetence.score, 55);
      });
    });
  });

  module('#onUpdateLevel', () => {
    module('when there is a given level', function () {
      test('it replaces competence level correctly', async function (assert) {
        // When
        await controller.onUpdateLevel(anExistingCompetenceCode, '5');

        // then
        const competences = controller.certification.competencesWithMark;
        const aCompetence = _getCompetenceWithMark(anExistingCompetenceCode, competences);

        assert.strictEqual(aCompetence.level, 5);
      });
    });

    module('when there is no given level and competence has no score', function () {
      test('it removes competence correctly (level)', async function (assert) {
        // When
        await controller.onUpdateLevel(anExistingCompetenceWithNoScoreCode, '');

        // then
        const competences = controller.certification.competencesWithMark;
        const aCompetence = _getCompetenceWithMark(anExistingCompetenceWithNoScoreCode, competences);

        assert.notOk(aCompetence);
      });
    });

    module('when the competence is not present', function () {
      test('it creates competence level correctly', async function (assert) {
        // When
        await controller.onUpdateLevel(aNewCompetenceCode, '8');

        // then
        const competences = controller.certification.competencesWithMark;
        const aCompetence = _getCompetenceWithMark(aNewCompetenceCode, competences);

        assert.strictEqual(aCompetence.level, 8);
      });
    });
  });

  module('#editJury', function () {
    test('it should set displayJuryLevelSelect to true', function (assert) {
      // given
      controller.displayJuryLevelSelect = false;

      // when
      controller.editJury();

      // then
      assert.true(controller.displayJuryLevelSelect);
    });
  });

  module('#onCancelJuryLevelEditButtonClick', function () {
    test('it should set displayJuryLevelSelect to false', function (assert) {
      // given
      controller.displayJuryLevelSelect = true;

      // when
      controller.onCancelJuryLevelEditButtonClick();

      // then
      assert.false(controller.displayJuryLevelSelect);
    });
  });

  module('#selectJuryLevel', function () {
    test('it should set selectedJuryLevel', function (assert) {
      // given
      controller.selectedJuryLevel = '';

      // when
      controller.selectJuryLevel('REJECTED');

      // then
      assert.strictEqual(controller.selectedJuryLevel, 'REJECTED');
    });
  });

  module('#onEditJuryLevelSave', function () {
    module('when the jury level is not empty', function () {
      test('it should save it', async function (assert) {
        // given
        const store = this.owner.lookup('service:store');
        controller.selectedJuryLevel = 'REJECTED';
        const complementaryCertificationCourseResultWithExternal = store.createRecord(
          'complementary-certification-course-result-with-external',
          {
            complementaryCertificationCourseId: 12345,
          },
        );

        controller.certification.save = sinon.stub().resolves();

        controller.certification.reload = sinon.stub().resolves();
        controller.certification.complementaryCertificationCourseResultWithExternal =
          complementaryCertificationCourseResultWithExternal;

        controller.displayJuryLevelSelect = true;

        // when
        await controller.onEditJuryLevelSave();

        // then
        assert.false(controller.displayJuryLevelSelect);
        sinon.assert.calledOnceWithExactly(controller.certification.save, {
          adapterOptions: {
            isJuryLevelEdit: true,
            juryLevel: 'REJECTED',
            complementaryCertificationCourseId: 12345,
          },
        });
        assert.ok(controller.certification.reload.calledOnce);
      });
    });

    module('when the jury level is empty', function () {
      test('it should not save it', async function (assert) {
        // given
        controller.selectedJuryLevel = null;
        controller.certification.editJuryLevel = sinon.stub().resolves();
        controller.certification.reload = sinon.stub().resolves();
        controller.displayJuryLevelSelect = true;

        // when
        await controller.onEditJuryLevelSave();

        // then
        assert.true(controller.displayJuryLevelSelect);
        assert.notOk(controller.certification.editJuryLevel.calledOnce);
        assert.notOk(controller.certification.reload.calledOnce);
      });
    });
  });

  module('#onJuryCommentSave', function () {
    test('it displays a success notification if jury comment is saved', async function (assert) {
      // given
      const controller = this.owner.lookup('controller:authenticated/certifications/certification/informations');
      controller.saveAssessmentResult = sinon.stub();
      controller.saveAssessmentResult.resolves();

      const notificationSuccessStub = sinon.stub();
      class NotificationsStub extends Service {
        sendSuccessNotification = notificationSuccessStub;
      }
      this.owner.register('service:pixToast', NotificationsStub);

      // when
      await controller.onJuryCommentSave();

      // then
      sinon.assert.calledOnce(notificationSuccessStub);
      assert.ok(controller);
    });

    test('it displays an error notification if jury comment cannot be saved', async function (assert) {
      // given
      const controller = this.owner.lookup('controller:authenticated/certifications/certification/informations');
      controller.saveAssessmentResult = sinon.stub();
      controller.saveAssessmentResult.throws();

      const notificationErrorStub = sinon.stub();
      class NotificationsStub extends Service {
        sendErrorNotification = notificationErrorStub;
      }
      this.owner.register('service:pixToast', NotificationsStub);

      // when
      await controller.onJuryCommentSave();

      // then
      sinon.assert.calledOnce(notificationErrorStub);
      assert.ok(controller);
    });
  });

  function _getCompetenceWithMark(code, competences = competencesWithMark) {
    return competences.find((value) => value.competence_code === code);
  }
});
