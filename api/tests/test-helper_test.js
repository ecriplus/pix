import { catchErr, expect, parseJsonStream } from './test-helper.js';

describe('Test helpers', function () {
  describe('#catchErr', function () {
    it('returns the error thrown in the tested function', async function () {
      // given
      const errorToThrow = new Error('An error occurred');
      const functionToTest = function () {
        throw errorToThrow;
      };

      // when
      const result = await catchErr(functionToTest)();

      // then
      expect(result).to.deepEqualInstance(errorToThrow);
    });

    it('throws a specific error if no error was thrown', async function () {
      // given
      const functionToTest = function () {
        return 'All went well';
      };

      // when
      const promise = catchErr(functionToTest)();

      // then
      await expect(promise).to.be.rejectedWith('Expected an error, but none was thrown.');
    });
  });

  describe('#parseJsonStream', function () {
    it('should parse JSONStream data', function () {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const data = [JSON.stringify(obj1), JSON.stringify(obj2), ''].join('\n');

      expect(
        parseJsonStream({
          result: data,
        }),
      ).to.deep.equal([obj1, obj2]);
    });
  });

  describe('#equalWithGetter', function () {
    class A {
      get name() {
        return "i'm A";
      }
    }
    class B {
      get name() {
        return "i'm B";
      }
      get A() {
        return [new A()];
      }
    }

    it('should expect on object', function () {
      expect({ name: 'ho' }).equalWithGetter({ name: 'ho' });
    });

    it('should expect on array of object', function () {
      expect([{ name: 'ho' }]).equalWithGetter([{ name: 'ho' }]);
    });

    it('should expect on class instance with getter', function () {
      expect(new A()).equalWithGetter({ name: "i'm A" });
    });

    it('should expect on array of class instance with getter', function () {
      expect([new A()]).equalWithGetter([{ name: "i'm A" }]);
    });

    it('should expect on nested class instance with getter', function () {
      expect(new B()).equalWithGetter({ name: "i'm B", A: [{ name: "i'm A" }] });
    });

    it('should expect on array nested class instance with getter', function () {
      expect([new B()]).equalWithGetter([{ name: "i'm B", A: [{ name: "i'm A" }] }]);
    });
  });
});
