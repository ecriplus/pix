import {
  asyncLocalStorage,
  getContext,
  getInContext,
  setInContext,
} from '../../../../src/shared/infrastructure/async-local-storage.js';
import { expect } from '../../../test-helper.js';

describe('Shared | Unit | Infrastructure | async-local-storage', function () {
  describe('#getContext', function () {
    it('should return async local storage', function () {
      // given
      const expectedResult = { foo: 'bar' };

      // when
      const result = asyncLocalStorage.run(expectedResult, () => getContext());

      // then
      expect(result).to.deep.equal(expectedResult);
    });
  });

  describe('#getInContext', function () {
    it('should return value from given path', function () {
      // given
      const expectedResult = 'baz';
      const context = { foo: { bar: expectedResult } };

      // when
      const result = asyncLocalStorage.run(context, () => getInContext('foo.bar'));

      // then
      expect(result).to.deep.equal(expectedResult);
    });

    it('should return defaultValue when given path is undefined', function () {
      // given
      const defaultValue = 'foo';
      const context = {};

      // when
      const result = asyncLocalStorage.run(context, () => getInContext('foo.bar', defaultValue));

      // then
      expect(result).to.deep.equal(defaultValue);
    });
  });

  describe('#setInContext', function () {
    it('should set value in given path', function () {
      // given
      const givenValue = 'baz';
      const givenPath = 'foo.bar';
      const context = {};

      // when
      const result = asyncLocalStorage.run(context, () => {
        setInContext(givenPath, givenValue);
        return asyncLocalStorage.getStore();
      });

      // then
      expect(result.foo.bar).to.equal(givenValue);
    });
  });
});
