import { useLevenshteinRatio } from 'mon-pix/utils/levenshtein-validation';
import { module, test } from 'qunit';

module('Unit | Utility | levenshtein validation', function () {
  module('#useLevenshteinRatio', function () {
    module('if tolerance #3 exists in enabled tolerances list', function () {
      test('should return true', function (assert) {
        // given
        const enabledTolerances = ['t1', 't3'];

        // when
        const isExist = useLevenshteinRatio(enabledTolerances);

        // then
        assert.true(isExist);
      });
    });

    module('if tolerance #3 does not exist in enabled tolerances list', function () {
      test('should return false', function (assert) {
        // given
        const enabledTolerances = ['t1', 't2'];

        // when
        const isExist = useLevenshteinRatio(enabledTolerances);

        // then
        assert.false(isExist);
      });
    });
  });
});
