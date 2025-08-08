import { CustomElement } from '../../../../../../src/devcomp/domain/models/element/CustomElement.js';
import { DomainError } from '../../../../../../src/shared/domain/errors.js';
import { catchErrSync, expect } from '../../../../../test-helper.js';

describe('Unit | Devcomp | Domain | Models | Element | CustomElement', function () {
  describe('#constructor', function () {
    it('should create a valid CustomElement object', function () {
      // given
      const attributes = {
        id: '5ce0ddf1-8620-43b5-9e43-cd9b2ffaca17',
        tagName: 'qcu-image',
        props: {
          name: "Liste d'applications",
          maxChoicesPerLine: 3,
          imageChoicesSize: 'icon',
          choices: [
            {
              name: 'Google',
              image: {
                width: 534,
                height: 544,
                loading: 'lazy',
                decoding: 'async',
                src: 'https://epreuves.pix.fr/_astro/Google.B1bcY5Go_1BynY8.svg',
              },
            },
            {
              name: 'LibreOffice Writer',
              image: {
                width: 205,
                height: 246,
                loading: 'lazy',
                decoding: 'async',
                src: 'https://epreuves.pix.fr/_astro/writer.3bR8N2DK_Z1iWuJ9.webp',
              },
            },
            {
              name: 'Explorateur',
              image: {
                width: 128,
                height: 128,
                loading: 'lazy',
                decoding: 'async',
                src: 'https://epreuves.pix.fr/_astro/windows-file-explorer.CnF8MYwI_23driA.webp',
              },
            },
            {
              name: 'Geogebra',
              image: {
                width: 640,
                height: 640,
                loading: 'lazy',
                decoding: 'async',
                src: 'https://epreuves.pix.fr/_astro/geogebra.CZH9VYqc_19v4nj.webp',
              },
            },
          ],
        },
      };

      // when
      const result = new CustomElement(attributes);

      // then
      expect(result.id).to.equal(attributes.id);
      expect(result.tagName).to.equal(attributes.tagName);
      expect(result.props).to.deep.equal(attributes.props);
      expect(result.type).to.equal('custom');
    });
  });

  describe('A CustomElement without a tagName', function () {
    it('should throw an error', function () {
      const attributes = {
        id: '5ce0ddf1-8620-43b5-9e43-cd9b2ffaca17',
      };
      // when
      const error = catchErrSync(() => new CustomElement(attributes))();

      // then
      expect(error).to.be.instanceOf(DomainError);
      expect(error.message).to.equal('The tagName is required for a CustomElement element');
    });
  });

  describe('A CustomElement without props', function () {
    it('should throw an error', function () {
      const attributes = {
        id: '5ce0ddf1-8620-43b5-9e43-cd9b2ffaca17',
        tagName: 'qcu-image',
      };
      // when
      const error = catchErrSync(() => new CustomElement(attributes))();

      // then
      expect(error).to.be.instanceOf(DomainError);
      expect(error.message).to.equal('The props are required for a CustomElement element');
    });
  });

  describe('Convert MODULIX-EDITOR default values to POI optional values', function () {
    describe('static unsetObject', function () {
      describe('when object has falsy values', function () {
        it('should unset empty object', function () {
          const result = CustomElement.unsetObject({});
          expect(result).to.equal(undefined);
        });

        it('should unset object with falsy values', function () {
          const result = CustomElement.unsetObject({
            number: 0,
            string: '',
            boolean: false,
            undefined: undefined,
            null: null,
          });
          expect(result).to.equal(undefined);
        });
      });

      describe('when object has truthy values', function () {
        it('should return original object', function () {
          const object = {
            number: 1,
            string: 'a',
            boolean: true,
            undefined: undefined,
            null: null,
          };
          const result = CustomElement.unsetObject(object);
          expect(result).to.equal(object);
        });
      });
    });

    describe('static unsetNumber', function () {
      it('should unset 0 to undefined', function () {
        const result = CustomElement.unsetNumber(0);
        expect(result).to.equal(undefined);
      });

      const unmodifiedExamples = [1, '0', '123', -1, undefined, null];
      unmodifiedExamples.forEach((value) => {
        it('should return original value', function () {
          const result = CustomElement.unsetNumber(value);
          expect(result).to.equal(value);
        });
      });
    });

    describe('pix-carousel', function () {
      it('should normalize props', function () {
        const pixCarouselElement = new CustomElement({
          id: 'adzadaz-azdzad-azdazddza-dzazad',
          tagName: 'pix-carousel',
          props: {
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
          },
        });

        expect(pixCarouselElement.props).to.be.deep.equal({
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

    describe('image-quizzes', function () {
      const singleVariants = ['image-quiz', 'qcu-image'];

      singleVariants.forEach((variant) => {
        it(`should normalize ${variant} props`, function () {
          const imageQuizElement = new CustomElement({
            id: 'adzadaz-azdzad-azdazddza-dzazad',
            tagName: variant,
            props: {
              name: 'test',
              maxChoicesPerLine: 0,
              imageChoicesSize: 'large',
              choices: [
                {
                  name: 'Test : J’utilise un test unitaire. J’utilise ce type de test uniquement pour atteindre mes objectifs annuels.',
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
          });

          expect(imageQuizElement.props).to.be.deep.equal({
            name: 'test',
            maxChoicesPerLine: undefined,
            imageChoicesSize: 'large',
            choices: [
              {
                name: 'Test : J’utilise un test unitaire. J’utilise ce type de test uniquement pour atteindre mes objectifs annuels.',
                image: undefined,
                response: 'different',
              },
            ],
            hideChoicesName: true,
            orderChoices: false,
          });
        });
      });

      it('should normalize props', function () {
        const imageQuizElement = new CustomElement({
          id: 'adzadaz-azdzad-azdazddza-dzazad',
          tagName: 'image-quizzes',
          props: {
            quizzes: [
              {
                name: 'test',
                maxChoicesPerLine: 0,
                imageChoicesSize: 'large',
                choices: [
                  {
                    name: 'Test : J’utilise un test unitaire. J’utilise ce type de test uniquement pour atteindre mes objectifs annuels.',
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
          },
        });

        expect(imageQuizElement.props).to.be.deep.equal({
          quizzes: [
            {
              name: 'test',
              maxChoicesPerLine: undefined,
              imageChoicesSize: 'large',
              choices: [
                {
                  name: 'Test : J’utilise un test unitaire. J’utilise ce type de test uniquement pour atteindre mes objectifs annuels.',
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
  });
});
