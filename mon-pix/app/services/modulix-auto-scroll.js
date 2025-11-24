import { action } from '@ember/object';
import Service, { service } from '@ember/service';

export default class ModulixAutoScroll extends Service {
  @service modulixPreviewMode;
  @service media;

  #DISTANCE_BETWEEN_GRAIN_AND_NAVBAR_PX = 70;
  #MOBILE_NAVBAR_HEIGHT = 72;

  @action
  setHTMLElementScrollOffsetCssProperty(htmlElement) {
    htmlElement.style.setProperty('--scroll-offset', `${this.#getScrollOffset()}px`);
  }

  get #bannerHeight() {
    const bannerElement = document.getElementById('pix-layout-banner-container');
    if (!bannerElement) {
      return 0;
    }

    return bannerElement.getBoundingClientRect().height;
  }

  #getNavbar() {
    return document.getElementById('module-navigation');
  }

  #getNavbarHeight({ getNavbar }) {
    const navbar = getNavbar();
    if (!navbar || this.media.isDesktop) {
      return 0;
    }

    return this.#MOBILE_NAVBAR_HEIGHT;
  }

  #getScrollOffset({ getNavbar } = { getNavbar: this.#getNavbar }) {
    const bannerHeight = this.#bannerHeight;
    const distanceBetweenBannerAndNavBar = this.#bannerHeight > 0 ? 8 : 0;
    const navbarHeight = this.#getNavbarHeight({ getNavbar }) + distanceBetweenBannerAndNavBar;
    return bannerHeight + navbarHeight + this.#DISTANCE_BETWEEN_GRAIN_AND_NAVBAR_PX;
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
}
