import { setupTest } from 'ember-qunit';
import Joi from 'joi';
import { FormValidator } from 'pix-admin/utils/form-validator';
import { module, test } from 'qunit';

module('Unit | Utils | FormValidator', function (hooks) {
  setupTest(hooks);

  const SCHEMA = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().messages({ 'string.empty': 'Password required !!!' }),
  });

  module('constructor', function () {
    test('initialize the FormValidator state', function (assert) {
      // when
      const validator = new FormValidator(SCHEMA);

      // then
      assert.deepEqual(validator.errors, {});
    });
  });

  module('validate', function () {
    test('is valid when the data match the Joi schema', function (assert) {
      // given
      const validator = new FormValidator(SCHEMA);

      // when
      const isValid = validator.validate({ email: 'hello@world.com', password: 's3cr3t' });

      // then
      assert.true(isValid);
      assert.deepEqual(validator.errors, {});
    });

    test('is invalid when the data does not match the Joi schema', function (assert) {
      // given
      const validator = new FormValidator(SCHEMA);

      // when
      const isValid = validator.validate({ email: 'hello', password: '' });

      // then
      assert.false(isValid);
      assert.deepEqual(validator.errors, {
        email: '"email" must be a valid email',
        password: 'Password required !!!',
      });
    });
  });

  module('validateField', function () {
    test('is valid when the field data match the Joi field schema', function (assert) {
      // given
      const validator = new FormValidator(SCHEMA);

      // when
      const isValid = validator.validateField('email', 'hello@world.com');

      // then
      assert.true(isValid);
      assert.strictEqual(validator.errors.email, undefined);
    });

    test('is invalid when the field data does not match the Joi field schema', function (assert) {
      // given
      const validator = new FormValidator(SCHEMA);

      // when
      const isValid = validator.validateField('email', 'hello');

      // then
      assert.false(isValid);
      assert.deepEqual(validator.errors.email, '"value" must be a valid email');
    });

    test('keeps other fields errors when validating', function (assert) {
      // given
      const validator = new FormValidator(SCHEMA);

      // when
      validator.validateField('email', 'hello');
      validator.validateField('password', '');

      // then
      assert.deepEqual(validator.errors, {
        email: '"value" must be a valid email',
        password: 'Password required !!!',
      });
    });
  });
});
