import { fillByLabel, render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';
import { waitForDialog } from '../../../helpers/wait-for';

module('Integration | Component | Team::InviteForm', function (hooks) {
  setupIntlRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.set('inviteSpy', () => {});
    this.set('cancelSpy', () => {});
    this.set('updateEmail', sinon.spy());
  });

  test('it should contain email input and validation button', async function (assert) {
    // when
    const screen = await render(
      hbs`<Team::InviteForm @onSubmit={{this.inviteSpy}} @onCancel={{this.cancelSpy}} @onUpdateEmail={{this.updateEmail}} />`,
    );

    // then
    assert.dom('#email').exists();
    assert.dom('#email').isRequired();
    assert.ok(screen.getByText(t('pages.team-new-item.invite-button')));
    assert.dom(screen.queryByRole('dialog')).doesNotExist();
  });
  test('it should bind organizationInvitation properties with email form input', async function (assert) {
    // given
    this.set('email', 'toto@org.fr');
    await render(
      hbs`<Team::InviteForm
  @email={{this.email}}
  @onSubmit={{this.inviteSpy}}
  @onCancel={{this.cancelSpy}}
  @onUpdateEmail={{this.updateEmail}}
/>`,
    );

    // when
    const inputLabel = `${t('pages.team-new-item.input-label')} *`;
    await fillByLabel(inputLabel, 'dev@example.net');

    // then
    assert.ok(this.updateEmail.called);
  });
  test('it should open confirmation modal when invite button is clicked', async function (assert) {
    // given
    this.set('email', 'toto@org.fr');
    const screen = await render(
      hbs`<Team::InviteForm
  @email={{this.email}}
  @onSubmit={{this.inviteSpy}}
  @onCancel={{this.cancelSpy}}
  @onUpdateEmail={{this.updateEmail}}
/>`,
    );

    // when
    const inputLabel = `${t('pages.team-new-item.input-label')} *`;
    await fillByLabel(inputLabel, 'dev@example.net');
    const inviteButton = await screen.findByRole('button', {
      name: t('pages.team-new-item.invite-button'),
    });

    await click(inviteButton);
    await waitForDialog();

    // then
    assert.dom(screen.getByRole('dialog')).isVisible();
  });
  test('it should display error message when no email is in input and invite button is clicked', async function (assert) {
    // given
    this.set('email', '');
    const errorMessage = t('pages.team-new.errors.mandatory-email-field');
    const screen = await render(
      hbs`<Team::InviteForm
  @email={{this.email}}
  @onSubmit={{this.inviteSpy}}
  @onCancel={{this.cancelSpy}}
  @onUpdateEmail={{this.updateEmail}}
/>`,
    );

    // when
    const inputLabel = `${t('pages.team-new-item.input-label')} *`;
    await fillByLabel(inputLabel, '');
    const inviteButton = await screen.findByRole('button', {
      name: t('pages.team-new-item.invite-button'),
    });

    await click(inviteButton);

    // then
    assert.dom(await screen.findByText(errorMessage)).exists();
    assert.dom(screen.queryByRole('dialog')).doesNotExist();
  });
  test('it should display error message when email format is not correct', async function (assert) {
    // given
    this.set('email', 'toto@org.fr;alex-mail.incorrect');
    const errorMessage = t('pages.team-new.errors.invalid-input');
    const screen = await render(
      hbs`<Team::InviteForm
  @email={{this.email}}
  @onSubmit={{this.inviteSpy}}
  @onCancel={{this.cancelSpy}}
  @onUpdateEmail={{this.updateEmail}}
/>`,
    );

    // when
    const inviteButton = await screen.findByRole('button', {
      name: t('pages.team-new-item.invite-button'),
    });

    await click(inviteButton);

    // then
    assert.dom(await screen.findByText(errorMessage)).exists();
    assert.dom(screen.queryByRole('dialog')).doesNotExist();
  });
});
