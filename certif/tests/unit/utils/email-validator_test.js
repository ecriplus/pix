import { setupTest } from 'ember-qunit';
import isEmailValid from 'pix-certif/utils/email-validator';
import { module, test } from 'qunit';

module('Unit | Utils | email validator', function (hooks) {
  setupTest(hooks);

  module('Invalid emails', function () {
    [
      '',
      ' ',
      null,
      'INVALID_EMAIL',
      'INVALID_EMAIL@',
      'INVALID_EMAIL@pix',
      'INVALID_EMAIL@pix.',
      '@pix.fr',
      '@pix',
    ].forEach(function (badEmail) {
      test(`should return false when email is invalid: ${badEmail}`, function (assert) {
        assert.false(isEmailValid(badEmail));
      });
    });
  });

  module('Valid emails', function () {
    [
      'user@pix.fr',
      'user@pix.fr ',
      ' user@pix.fr',
      ' user@pix.fr ',
      ' user-beta@pix.fr ',
      ' User_Beta@pix.fr ',
      'user+beta@pix.fr',
      'user+beta@pix.gouv.fr',
      'user+beta@pix.beta.gouv.fr',
    ].forEach(function (validEmail) {
      test(`should return true if provided email is valid: ${validEmail}`, function (assert) {
        assert.true(isEmailValid(validEmail));
      });
    });
  });
});
