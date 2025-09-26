import { render } from '@1024pix/ember-testing-library';
import { click, fillIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupIntl, t } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Integration | Component | sessions/edition-form', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks, 'fr');

  let routerStub;
  let pixToastStub;

  hooks.beforeEach(function () {
    routerStub = this.owner.lookup('service:router');
    sinon.stub(routerStub, 'transitionTo');

    pixToastStub = this.owner.lookup('service:pix-toast');
    sinon.stub(pixToastStub, 'sendErrorNotification');
  });

  module('Creation mode (new session)', function (hooks) {
    let session;

    hooks.beforeEach(function () {
      session = {
        address: '',
        room: '',
        examiner: '',
        description: '',
        date: '',
        time: '',
        save: sinon.stub().resolves(),
      };

      this.set('session', session);
    });

    test('it renders the session creation form', async function (assert) {
      // when
      const screen = await render(hbs`<Sessions::EditionForm @session={{this.session}} />`);

      assert.dom(screen.getByRole('textbox', { name: 'Nom du site *' })).exists();
      assert.dom(screen.getByRole('textbox', { name: 'Nom de la salle *' })).exists();
      assert.dom(screen.getByRole('textbox', { name: 'Surveillant(s) *' })).exists();
      assert.dom(screen.getByRole('textbox', { name: t('common.forms.session-labels.observations') })).exists();
      assert.dom(screen.getByRole('button', { name: t('pages.sessions.new.actions.create-session') })).exists();
      assert
        .dom(screen.getByRole('button', { name: t('pages.sessions.new.actions.cancel-extra-information') }))
        .exists();
    });

    test('it updates session properties when form fields are filled', async function (assert) {
      // given
      const screen = await render(hbs`<Sessions::EditionForm @session={{this.session}} />`);

      // when
      await fillIn(screen.getByRole('textbox', { name: 'Nom du site *' }), 'Test Address');
      await fillIn(screen.getByRole('textbox', { name: 'Nom de la salle *' }), 'Test Room');
      await fillIn(screen.getByRole('textbox', { name: 'Surveillant(s) *' }), 'Test Examiner');
      await fillIn(
        screen.getByRole('textbox', { name: t('common.forms.session-labels.observations') }),
        'Test Description',
      );

      // then
      assert.strictEqual(session.address, 'Test Address');
      assert.strictEqual(session.room, 'Test Room');
      assert.strictEqual(session.examiner, 'Test Examiner');
      assert.strictEqual(session.description, 'Test Description');
    });

    test('it successfully creates a session with valid data', async function (assert) {
      // given
      const screen = await render(hbs`<Sessions::EditionForm @session={{this.session}} />`);

      await fillIn(screen.getByRole('textbox', { name: 'Nom du site *' }), 'Test Address');
      await fillIn(screen.getByRole('textbox', { name: 'Nom de la salle *' }), 'Test Room');
      await fillIn(screen.getByRole('textbox', { name: 'Surveillant(s) *' }), 'Test Examiner');
      await fillIn(screen.getByLabelText('Date de début *'), '2029-12-25');
      await fillIn(screen.getByLabelText('Heure de début (heure locale) *'), '13:45');

      this.session.id = 'session-id';

      // when
      await click(screen.getByRole('button', { name: t('pages.sessions.new.actions.create-session') }));

      // then
      assert.ok(session.save.calledOnce);

      assert.ok(routerStub.transitionTo.calledWith('authenticated.sessions.details', 'session-id'));
    });

    test('it marks required fields with required attribute', async function (assert) {
      // given
      const screen = await render(hbs`<Sessions::EditionForm @session={{this.session}} />`);

      // then
      assert.dom(screen.getByRole('textbox', { name: 'Nom du site *' })).hasAttribute('required');
      assert.dom(screen.getByRole('textbox', { name: 'Nom de la salle *' })).hasAttribute('required');
      assert.dom(screen.getByRole('textbox', { name: 'Surveillant(s) *' })).hasAttribute('required');
      assert.dom(screen.getByLabelText('Date de début *')).hasAttribute('required');
      assert.dom(screen.getByLabelText('Heure de début (heure locale) *')).hasAttribute('required');
      assert
        .dom(screen.getByRole('textbox', { name: t('common.forms.session-labels.observations') }))
        .doesNotHaveAttribute('required');
    });

    test('it prevents form submission when required fields are empty', async function (assert) {
      // given
      const screen = await render(hbs`<Sessions::EditionForm @session={{this.session}} />`);

      // when
      await click(screen.getByRole('button', { name: t('pages.sessions.new.actions.create-session') }));

      // then
      assert.notOk(session.save.called);
    });

    test('it redirects to sessions list when cancel is clicked in creation mode', async function (assert) {
      // given
      const screen = await render(hbs`<Sessions::EditionForm @session={{this.session}} />`);

      // when
      await click(screen.getByRole('button', { name: t('pages.sessions.new.actions.cancel-extra-information') }));

      // then
      assert.ok(routerStub.transitionTo.calledWith('authenticated.sessions'));
    });
  });

  module('Update mode (existing session)', function (hooks) {
    let session;

    hooks.beforeEach(function () {
      session = {
        address: 'Initial Address',
        room: 'Initial Room',
        examiner: 'Initial Examiner',
        description: 'Initial Description',
        date: '2029-12-20',
        time: '10:30',
        id: 'session-id', // Has ID = update mode
        save: sinon.stub().resolves(),
      };

      this.set('session', session);
    });

    test('it renders the session update form with existing values', async function (assert) {
      // when
      const screen = await render(hbs`<Sessions::EditionForm @session={{this.session}} />`);

      assert.dom(screen.getByRole('textbox', { name: 'Nom du site *' })).hasValue('Initial Address');
      assert.dom(screen.getByRole('textbox', { name: 'Nom de la salle *' })).hasValue('Initial Room');
      assert.dom(screen.getByRole('textbox', { name: 'Surveillant(s) *' })).hasValue('Initial Examiner');
      assert
        .dom(screen.getByRole('textbox', { name: t('common.forms.session-labels.observations') }))
        .hasValue('Initial Description');
      assert.dom(screen.getByDisplayValue('2029-12-20')).exists();
      assert.dom(screen.getByDisplayValue('10:30')).exists();
      assert.dom(screen.getByRole('button', { name: t('pages.sessions.update.actions.edit-session') })).exists();
      assert
        .dom(screen.getByRole('button', { name: t('pages.sessions.update.actions.cancel-extra-information') }))
        .exists();
    });

    test('it updates session properties when form fields are modified', async function (assert) {
      // given
      const screen = await render(hbs`<Sessions::EditionForm @session={{this.session}} />`);

      // when
      await fillIn(screen.getByRole('textbox', { name: 'Nom du site *' }), 'Updated Address');
      await fillIn(screen.getByRole('textbox', { name: 'Nom de la salle *' }), 'Updated Room');
      await fillIn(screen.getByRole('textbox', { name: 'Surveillant(s) *' }), 'Updated Examiner');
      await fillIn(
        screen.getByRole('textbox', { name: t('common.forms.session-labels.observations') }),
        'Updated Description',
      );

      // then
      assert.strictEqual(session.address, 'Updated Address');
      assert.strictEqual(session.room, 'Updated Room');
      assert.strictEqual(session.examiner, 'Updated Examiner');
      assert.strictEqual(session.description, 'Updated Description');
    });

    test('it updates date and time when native inputs are modified', async function (assert) {
      // given
      const screen = await render(hbs`<Sessions::EditionForm @session={{this.session}} />`);

      // when
      await fillIn(screen.getByLabelText('Date de début *'), '2030-01-15');
      await fillIn(screen.getByLabelText('Heure de début (heure locale) *'), '14:00');

      // then
      assert.strictEqual(session.date, '2030-01-15');
      assert.strictEqual(session.time, '14:00');
    });

    test('it successfully updates a session with valid data', async function (assert) {
      // given
      const screen = await render(hbs`<Sessions::EditionForm @session={{this.session}} />`);

      await fillIn(screen.getByRole('textbox', { name: 'Nom du site *' }), 'Updated Address');
      await fillIn(screen.getByRole('textbox', { name: 'Nom de la salle *' }), 'Updated Room');
      await fillIn(screen.getByRole('textbox', { name: 'Surveillant(s) *' }), 'Updated Examiner');
      await fillIn(screen.getByLabelText('Date de début *'), '2029-12-25');
      await fillIn(screen.getByLabelText('Heure de début (heure locale) *'), '13:45');

      // when
      await click(screen.getByRole('button', { name: t('pages.sessions.update.actions.edit-session') }));

      // then
      assert.ok(session.save.calledOnce);
      assert.ok(routerStub.transitionTo.calledWith('authenticated.sessions.details', 'session-id'));
    });

    test('it redirects to session details when cancel is clicked in update mode', async function (assert) {
      // given
      const screen = await render(hbs`<Sessions::EditionForm @session={{this.session}} />`);

      // when
      await click(screen.getByRole('button', { name: t('pages.sessions.update.actions.cancel-extra-information') }));

      // then
      assert.ok(routerStub.transitionTo.calledWith('authenticated.sessions.details', 'session-id'));
    });
  });

  module('Mode detection', function () {
    test('it detects creation mode when session has no ID', async function (assert) {
      // given
      const session = {
        address: '',
        room: '',
        examiner: '',
        save: sinon.stub().resolves(),
      };
      this.set('session', session);

      // when
      const screen = await render(hbs`<Sessions::EditionForm @session={{this.session}} />`);

      assert.dom(screen.getByRole('button', { name: t('pages.sessions.new.actions.create-session') })).exists();
      assert.dom(screen.getByRole('textbox', { name: 'Nom du site *' })).hasValue('');
    });

    test('it detects update mode when session has an ID', async function (assert) {
      // given
      const session = {
        address: 'Test Address',
        room: 'Test Room',
        examiner: 'Test Examiner',
        id: 'session-123',
        save: sinon.stub().resolves(),
      };
      this.set('session', session);

      // when
      const screen = await render(hbs`<Sessions::EditionForm @session={{this.session}} />`);

      assert.dom(screen.getByRole('button', { name: t('pages.sessions.update.actions.edit-session') })).exists();
      assert.dom(screen.getByRole('textbox', { name: 'Nom du site *' })).hasValue('Test Address');
    });
  });
});
