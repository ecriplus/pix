import { action } from '@ember/object';
import Service, { service } from '@ember/service';

export default class ModulixAutoScroll extends Service {
  @service modulixPreviewMode;

  #SCROLL_OFFSET_PX = 70;

  @action
  setHTMLElementScrollOffsetCssProperty(htmlElement) {
    htmlElement.style.setProperty('--scroll-offset', `${this.#SCROLL_OFFSET_PX}px`);
  }

  focusAndScroll(
    htmlElement,
    { scroll, userPrefersReducedMotion, getWindowScrollY, getNavbar } = {
      scroll: this.#scroll,
      userPrefersReducedMotion: this.#userPrefersReducedMotion,
      getWindowScrollY: this.#getWindowScrollY,
      getNavbar: this.#getNavbar,
    },
  ) {
    if (this.modulixPreviewMode.isEnabled) {
      return;
    }

    htmlElement.focus({ preventScroll: true });

    const elementY = htmlElement.getBoundingClientRect().top + getWindowScrollY();
    scroll({
      top: elementY - this.#getScrollOffset({ getNavbar }),
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

  #getNavbar() {
    return document.getElementById('module-navbar');
  }
}
