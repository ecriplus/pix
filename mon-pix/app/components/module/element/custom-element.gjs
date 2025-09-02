import { metadata } from '@1024pix/epreuves-components/metadata';
import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import didInsert from 'mon-pix/modifiers/modifier-did-insert';

import ModuleElement from './module-element';

export default class ModulixCustomElement extends ModuleElement {
  @tracked
  customElement;

  @tracked
  resetButtonDisplayed = false;

  @action
  mountCustomElement(container) {
    this.customElement = document.createElement(this.args.component.tagName);
    const props = new NormalizedProps(this.args.component.tagName, this.args.component.props);
    Object.assign(this.customElement, props);
    container.append(this.customElement);

    if (this.customElement.reset !== undefined) {
      this.resetButtonDisplayed = true;
    }
  }

  @action
  resetCustomElement() {
    this.customElement.reset();
  }

  get isInteractive() {
    if (metadata[this.args.component.tagName] !== undefined) {
      return metadata[this.args.component.tagName].isInteractive;
    } else {
      return true;
    }
  }

  <template>
    <div class="element-custom">
      {{#if this.isInteractive}}
        <fieldset class="element-custom__container">
          <legend class="element-custom__legend">
            <PixIcon @name="leftClick" @plainIcon={{false}} @ariaHidden={{true}} />
            <span>{{t "pages.modulix.interactiveElement.label"}}</span>
          </legend>
          <div {{didInsert this.mountCustomElement}} />
        </fieldset>
      {{else}}
        <div {{didInsert this.mountCustomElement}} />
      {{/if}}

      {{#if this.resetButtonDisplayed}}
        <div class="element-custom__reset">
          <PixButton
            @iconBefore="refresh"
            @variant="tertiary"
            @triggerAction={{this.resetCustomElement}}
            aria-label="{{t 'pages.modulix.buttons.interactive-element.reset.ariaLabel'}}"
          >{{t "pages.modulix.buttons.interactive-element.reset.name"}}</PixButton>
        </div>
      {{/if}}
    </div>
  </template>
}

export class NormalizedProps {
  constructor(tagName, props) {
    switch (tagName) {
      case 'pix-carousel':
        return this.normalizePixCarouselProps(props);
      case 'image-quiz':
      case 'qcu-image':
        return this.normalizeImageQuizProps(props);
      case 'image-quizzes':
        return this.normalizeImageQuizzesProps(props);
      case 'qcm-deepfake':
        return this.normalizeQcmDeepfakeProps(props);
      default:
        return props;
    }
  }

  normalizePixCarouselProps(props) {
    return {
      ...props,
      titleLevel: NormalizedProps.unsetNumber(props.titleLevel),
      slides: props.slides.map((slide) => ({
        ...slide,
        displayWidth: NormalizedProps.unsetNumber(slide.displayWidth),
        displayHeight: NormalizedProps.unsetNumber(slide.displayHeight),
        license: NormalizedProps.unsetObject(slide.license),
      })),
    };
  }

  normalizeQcmDeepfakeProps(props) {
    return {
      ...props,
      titleLevel: NormalizedProps.unsetNumber(props.titleLevel),
    };
  }

  normalizeImageQuizProps(props) {
    return {
      ...props,
      maxChoicesPerLine: NormalizedProps.unsetNumber(props.maxChoicesPerLine),
      choices: props.choices.map((choice) => ({
        ...choice,
        image: NormalizedProps.unsetObject(choice.image),
      })),
    };
  }

  normalizeImageQuizzesProps(props) {
    return {
      quizzes: props.quizzes.map((quiz) => this.normalizeImageQuizProps(quiz)),
    };
  }

  /**
   * @param{number|undefined} number
   */
  static unsetNumber(number) {
    return number === 0 ? undefined : number;
  }

  /**
   * @param{object|undefined} object
   */
  static unsetObject(object) {
    if (!object) return undefined;
    for (const value of Object.values(object)) {
      if (value) return object;
    }
    return undefined;
  }
}
