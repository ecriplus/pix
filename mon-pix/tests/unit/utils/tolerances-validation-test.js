import {
  applyTolerances,
  normalizeAndRemoveAccents,
  removeSpecialCharacters,
} from 'mon-pix/utils/tolerances-validation';
import { module, test } from 'qunit';

module('Unit | Utility | tolerances validation', function () {
  module('#normalizeAndRemoveAccents', function () {
    [
      { description: 'white spaces', input: '  foo  bar  ', expected: 'foobar' },
      { description: 'unbreakable spaces', input: 'unbreakable spaces', expected: 'unbreakablespaces' },
      { description: 'accents', input: 'àâäéèêëîïôöòûùüñń', expected: 'aaaeeeeiiooouuunn' },
      { description: 'cédille', input: 'hameçon', expected: 'hamecon' },
      { description: 'case', input: 'SHI-fu-Mi', expected: 'shi-fu-mi' },
    ].forEach((scenario) => {
      test(`should return the given string without "${scenario.description}"`, function (assert) {
        // given & when
        const result = normalizeAndRemoveAccents(scenario.input);

        // then
        assert.strictEqual(result, scenario.expected);
      });
    });

    test('should not modify æ and œ', function (assert) {
      // given & when
      const result = normalizeAndRemoveAccents('æ/œ');

      // then
      assert.strictEqual(result, 'æ/œ');
    });

    test('should return (a copy of) the given string unmodified if it contains no concerned characters', function (assert) {
      // given & when
      const result = normalizeAndRemoveAccents('shi-foo-bar');

      // then
      assert.strictEqual(result, 'shi-foo-bar');
    });
  });

  module('#removeSpecialCharacters', function () {
    [
      { description: 'all point types', input: '?Allo?,:;.', expected: 'Allo' },
      { description: 'slashs', input: '\\o/', expected: 'o' },
      { description: 'quotes', input: '"quotes"', expected: 'quotes' },
      { description: 'underscore and dashes', input: 'Shi-fu_mi', expected: 'Shifumi' },
      { description: 'parenthesis', input: '(anyway)', expected: 'anyway' },
    ].forEach((scenario) => {
      test(`should return the given string without "${scenario.description}"`, function (assert) {
        // given & when
        const result = removeSpecialCharacters(scenario.input);

        // then
        assert.strictEqual(result, scenario.expected);
      });
    });

    test('should return (a copy of) the given string unmodified if it contains no concerned characters', function (assert) {
      // given & when
      const result = removeSpecialCharacters('shi foo bar');

      // then
      assert.strictEqual(result, 'shi foo bar');
    });

    test('should return the good result even for complex phrase', function (assert) {
      // given & when
      const result = removeSpecialCharacters(
        'Th!!is., -/ is #! an $ % ^ & * example ;: {} of a = -_ string with `~)() punctuation',
      );

      // then
      assert.strictEqual(result, 'This is an example of a string with punctuation');
    });
  });

  module('#applyTolerances with enabled Tolerances', function () {
    const input = ' Shi Foo-Bar ';

    module('when the enabled tolerances array is not defined', function () {
      test('should return the given string without applying any tolerance', function (assert) {
        // given & when
        const result = applyTolerances(input);

        // then
        assert.strictEqual(result, input);
      });
    });

    module('when the enabled tolerances array is empty', function () {
      test('should return the given string without applying any tolerance', function (assert) {
        // given & when
        const result = applyTolerances(input, []);

        // then
        assert.strictEqual(result, input);
      });
    });

    module('when the enabled tolerances array does not contain "t1" nor "t2"', function () {
      test('should return the given string without applying any tolerance', function (assert) {
        // given & when
        const result = applyTolerances(input, ['t1000']);

        // then
        assert.strictEqual(result, input);
      });
    });

    test('should return a string with "t1" applied if it is set as enabled tolerance', function (assert) {
      // given & when
      const result = applyTolerances(input, ['t1']);

      // then
      assert.strictEqual(result, 'shifoo-bar');
    });

    test('should return a string with "t2" applied if it is set as enabled tolerance', function (assert) {
      // given & when
      const result = applyTolerances(input, ['t2']);

      // then
      assert.strictEqual(result, ' Shi FooBar ');
    });
  });
});
