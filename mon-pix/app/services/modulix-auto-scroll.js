import { action } from '@ember/object';
import Service, { service } from '@ember/service';

export default class ModulixAutoScroll extends Service {
  @service modulixPreviewMode;

  #DISTANCE_BETWEEN_GRAIN_AND_PAGE_TOP_PX = 70;

  @action
  setHTMLElementScrollOffsetCssProperty(htmlElement) {
    htmlElement.style.setProperty('--scroll-offset', `${this.#getScrollOffset()}px`);
  }

  #getScrollOffset() {
    return this.#DISTANCE_BETWEEN_GRAIN_AND_PAGE_TOP_PX;
  }

  focusAndScroll(
    htmlElement,
    { scroll, userPrefersReducedMotion, getWindowScrollY } = {
      scroll: this.#scroll,
      userPrefersReducedMotion: this.#userPrefersReducedMotion,
      getWindowScrollY: this.#getWindowScrollY,
    },
  ) {
    if (this.modulixPreviewMode.isEnabled) {
      return;
    }

    htmlElement.focus({ preventScroll: true });

    const elementY = htmlElement.getBoundingClientRect().top + getWindowScrollY();
    scroll({
      top: elementY - this.#getScrollOffset(),
      behavior: userPrefersReducedMotion() ? 'instant' : 'smooth',
    });
  }

  #scroll(args) {
    window.scroll(args);
  }

  #userPrefersReducedMotion() {
    const userPrefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    return userPrefersReducedMotion.matches;
  }

  #getWindowScrollY() {
    return window.scrollY;
  }
}
