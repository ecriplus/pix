import { NormalizedProps } from 'mon-pix/components/module/element/custom-element';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | Custom Element', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('NormalizedProps', function () {
    module("when custom element's props don't need normalization", function () {
      test('should not unset potentially optional values', function (assert) {
        // given
        const props = {
          patatesCount: 0,
          patateDetails: {
            variety: '',
            size: 0,
          },
        };

        // when
        const normalizedProps = new NormalizedProps('patate', props);

        // then
        assert.deepEqual(props, normalizedProps);
      });
    });

    module('when custom element is pix-carousel', function () {
      test('should unset optional values', function (assert) {
        // given
        const props = {
          aspectRatio: 1.84,
          titleLevel: 0,
          type: 'image',
          randomSlides: false,
          disableAnimation: false,
          slides: [
            {
              title: 'Situation A',
              displayWidth: 0,
              displayHeight: 0,
              description: 'Super description!',
              image: {
                src: 'https://epreuves.pix.fr/_astro/connaitre_va1_profil2.DsTLuIpH.jpg',
                alt: 'une alternative A avec des "double quotes"',
              },
              license: {
                name: '',
                attribution: '',
                url: '',
              },
            },
          ],
        };

        // when
        const normalizedProps = new NormalizedProps('pix-carousel', props);

        // then
        assert.deepEqual(normalizedProps, {
          aspectRatio: 1.84,
          titleLevel: undefined,
          type: 'image',
          randomSlides: false,
          disableAnimation: false,
          slides: [
            {
              title: 'Situation A',
              displayWidth: undefined,
              displayHeight: undefined,
              description: 'Super description!',
              image: {
                src: 'https://epreuves.pix.fr/_astro/connaitre_va1_profil2.DsTLuIpH.jpg',
                alt: 'une alternative A avec des "double quotes"',
              },
              license: undefined,
            },
          ],
        });
      });
    });

    module('when custom element is an image-quiz variant', function () {
      const singleVariants = ['image-quiz', 'qcu-image'];

      singleVariants.forEach((variant) => {
        test(`should unset optional values`, function (assert) {
          // given
          const props = {
            name: 'test',
            maxChoicesPerLine: 0,
            imageChoicesSize: 'large',
            choices: [
              {
                name: 'Test',
                image: {
                  src: '',
                  width: 0,
                  height: 0,
                },
                response: 'different',
              },
            ],
            hideChoicesName: true,
            orderChoices: false,
          };

          // when
          const normalizedProps = new NormalizedProps(variant, props);

          // then
          assert.deepEqual(normalizedProps, {
            name: 'test',
            maxChoicesPerLine: undefined,
            imageChoicesSize: 'large',
            choices: [
              {
                name: 'Test',
                image: undefined,
                response: 'different',
              },
            ],
            hideChoicesName: true,
            orderChoices: false,
          });
        });
      });

      test('should normalize props', function (assert) {
        const props = {
          quizzes: [
            {
              name: 'test',
              maxChoicesPerLine: 0,
              imageChoicesSize: 'large',
              choices: [
                {
                  name: 'Test',
                  image: {
                    src: '',
                    width: 0,
                    height: 0,
                  },
                  response: 'different',
                },
              ],
              hideChoicesName: true,
              orderChoices: false,
            },
          ],
        };

        const normalizedProps = new NormalizedProps('image-quizzes', props);

        // then
        assert.deepEqual(normalizedProps, {
          quizzes: [
            {
              name: 'test',
              maxChoicesPerLine: undefined,
              imageChoicesSize: 'large',
              choices: [
                {
                  name: 'Test',
                  image: undefined,
                  response: 'different',
                },
              ],
              hideChoicesName: true,
              orderChoices: false,
            },
          ],
        });
      });
    });

    module('#unsetNumber', function () {
      test('should unset 0 to undefined', function (assert) {
        const result = NormalizedProps.unsetNumber(0);
        assert.strictEqual(result, undefined);
      });

      const unmodifiedExamples = [1, '0', '123', -1, undefined, null];
      unmodifiedExamples.forEach((value) => {
        test('should return original value', function (assert) {
          const result = NormalizedProps.unsetNumber(value);
          assert.strictEqual(result, value);
        });
      });
    });

    module('#unsetObject', function () {
      module('when object has falsy values', function () {
        test('should unset empty object', function (assert) {
          const result = NormalizedProps.unsetObject({});
          assert.strictEqual(result, undefined);
        });

        test('should unset object with falsy values', function (assert) {
          const result = NormalizedProps.unsetObject({
            number: 0,
            string: '',
            boolean: false,
            undefined: undefined,
            null: null,
          });
          assert.strictEqual(result, undefined);
        });
      });

      module('when object has truthy values', function () {
        test('should return original object', function (assert) {
          const object = {
            number: 1,
            string: 'a',
            boolean: true,
            undefined: undefined,
            null: null,
          };
          const result = NormalizedProps.unsetObject(object);
          assert.strictEqual(result, object);
        });
      });
    });
  });
});
