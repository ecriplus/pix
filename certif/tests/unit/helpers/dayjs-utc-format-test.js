import { dayjsUtcFormat } from 'pix-certif/helpers/dayjs-utc-format';
import { module, test } from 'qunit';

module('Unit | Helpers | dayjs-utc-format', function () {
  module('when formatting a date', function () {
    test('it formats a YYYY-MM-DD date to DD/MM/YYYY', function (assert) {
      // when
      const result = dayjsUtcFormat(['2020-12-01', 'DD/MM/YYYY'], {});

      // then
      assert.strictEqual(result, '01/12/2020');
    });

    test('it formats a date with time information without timezone shift', function (assert) {
      // when
      const result = dayjsUtcFormat(['2020-12-01T00:00:00Z', 'DD/MM/YYYY'], {});

      // then
      assert.strictEqual(result, '01/12/2020');
    });

    test('it formats a date with localized format', function (assert) {
      // when
      const result = dayjsUtcFormat(['2020-12-01', 'YYYY'], {});

      // then
      assert.strictEqual(result, '2020');
    });
  });

  module('when formatting a time', function () {
    test('it formats a HH:mm:ss time to HH:mm using inputFormat', function (assert) {
      // when
      const result = dayjsUtcFormat(['15:30:00', 'HH:mm'], { inputFormat: 'HH:mm:ss' });

      // then
      assert.strictEqual(result, '15:30');
    });
  });

  module('when value is empty', function () {
    test('it returns empty string when allowEmpty is true and value is null', function (assert) {
      // when
      const result = dayjsUtcFormat([null, 'DD/MM/YYYY'], { allowEmpty: true });

      // then
      assert.strictEqual(result, '');
    });

    test('it returns empty string when allowEmpty is true and value is undefined', function (assert) {
      // when
      const result = dayjsUtcFormat([undefined, 'DD/MM/YYYY'], { allowEmpty: true });

      // then
      assert.strictEqual(result, '');
    });

    test('it returns null when allowEmpty is falsy and value is null', function (assert) {
      // when
      const result = dayjsUtcFormat([null, 'DD/MM/YYYY'], {});

      // then
      assert.strictEqual(result, null);
    });
  });

  module('when value is invalid', function () {
    test('it returns empty string when allowEmpty is true', function (assert) {
      // when
      const result = dayjsUtcFormat(['not-a-date', 'DD/MM/YYYY'], { allowEmpty: true });

      // then
      assert.strictEqual(result, '');
    });

    test('it returns null when allowEmpty is falsy', function (assert) {
      // when
      const result = dayjsUtcFormat(['not-a-date', 'DD/MM/YYYY'], {});

      // then
      assert.strictEqual(result, null);
    });
  });
});
