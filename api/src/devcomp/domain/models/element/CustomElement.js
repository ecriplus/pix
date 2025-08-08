import { assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';
import { Element } from './Element.js';

class CustomElement extends Element {
  /**
   * @param{object} params
   * @param{string} params.id
   * @param{string} params.tagName
   * @param{string} params.props
   */
  constructor({ id, tagName, props }) {
    super({ id, type: 'custom' });
    assertNotNullOrUndefined(tagName, 'The tagName is required for a CustomElement element');
    assertNotNullOrUndefined(props, 'The props are required for a CustomElement element');
    this.tagName = tagName;
    this.props = this.#normalizeProps(props);
  }

  /**
   * @param{object} props
   */
  #normalizeProps(props) {
    switch (this.tagName) {
      case 'pix-carousel':
        return this.#normalizePixCarouselProps(props);
      case 'image-quiz':
      case 'qcu-image':
        return this.#normalizeImageQuizProps(props);
      case 'image-quizzes':
        return this.#normalizeImageQuizzesProps(props);
      default:
        return props;
    }
  }

  /**
   * @param{object} props
   */
  #normalizePixCarouselProps(props) {
    return {
      ...props,
      titleLevel: CustomElement.unsetNumber(props.titleLevel),
      slides: props.slides.map((slide) => ({
        ...slide,
        displayWidth: CustomElement.unsetNumber(slide.displayWidth),
        displayHeight: CustomElement.unsetNumber(slide.displayHeight),
        license: CustomElement.unsetObject(slide.license),
      })),
    };
  }

  /**
   * @param{object} props
   */
  #normalizeImageQuizProps(props) {
    return {
      ...props,
      maxChoicesPerLine: CustomElement.unsetNumber(props.maxChoicesPerLine),
      choices: props.choices.map((choice) => ({
        ...choice,
        image: CustomElement.unsetObject(choice.image),
      })),
    };
  }

  /**
   * @param{object} props
   */
  #normalizeImageQuizzesProps(props) {
    return {
      quizzes: props.quizzes.map((quiz) => this.#normalizeImageQuizProps(quiz)),
    };
  }

  /**
   * @param{number|undefined} number
   */
  static unsetNumber(number) {
    return number === 0 ? undefined : number;
  }

  /**
   * @param{object} object
   */
  static unsetObject(object) {
    if (!object) return undefined;
    for (const value of Object.values(object)) {
      if (value) return object;
    }
    return undefined;
  }
}

export { CustomElement };
