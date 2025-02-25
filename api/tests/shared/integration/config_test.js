import { schema } from '../../../src/shared/config.js';
import { expect } from '../../test-helper.js';

describe('Shared | Integration | Config', function () {
  describe('schema', function () {
    describe('when MADDO=true', function () {
      it('should require only MaDDo mandatory environment variables', function () {
        // given
        const env = {
          MADDO: 'true',
          AUTH_SECRET: 'auth secret',
          LOG_ENABLED: 'true',
        };

        // when
        const result = schema.validate(env);

        // then
        expect(result).not.to.have.property('error');
      });
    });
  });
});
