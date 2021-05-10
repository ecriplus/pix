import { expect } from 'chai';
import { describe, it } from 'mocha';
import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';
import { click, find, render, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | hexagon-score', function() {
  setupIntlRenderingTest();

  describe('Component rendering', function() {

    it('should render component', async function() {
      // when
      await render(hbs`<HexagonScore />`);
      // then

      expect(this.element.querySelector('.hexagon-score')).to.exist;
    });

    it('should display two dashes, when no pixScore provided', async function() {
      // when
      await render(hbs`<HexagonScore />`);

      // then
      expect(this.element.querySelector('.hexagon-score-content__pix-score').innerHTML).to.equal('–');
    });

    it('should display provided score in hexagon', async function() {
      // given
      const pixScore = '777';
      this.set('pixScore', pixScore);
      // when
      await render(hbs`<HexagonScore @pixScore={{this.pixScore}} />`);
      // then
      expect(this.element.querySelector('.hexagon-score-content__pix-score').innerHTML).to.equal(pixScore);
    });
  });

  describe('Tooltip behaviour', () => {
    const tooltip = '.hexagon-score__information';

    beforeEach(async () => {
      await render(hbs`<HexagonScore />`);
      expect(find(tooltip)).not.to.exist;
    });

    describe('on click', () => {
      it('should display tooltip on click when tooltip is hidden', async function() {
        // when
        await click('.hexagon-score-content__pix-total button');

        // then
        expect(find(tooltip)).to.exist;
      });

      it('should hide tooltip on click when tooltip is displayed', async function() {
        // when
        await click('.hexagon-score-content__pix-total button');
        await click('.hexagon-score-content__pix-total button');

        // then
        expect(find(tooltip)).not.to.exist;
      });
    });

    describe('on hover', () => {

      it('should display tooltip when mouse enters the score hexagon', async function() {
        // when
        await triggerEvent('.hexagon-score', 'mouseenter');

        // then
        expect(find(tooltip)).to.exist;
      });

      it('should hide tooltip when mouse leaves the score hexagon', async function() {
        // when
        await triggerEvent('.hexagon-score', 'mouseenter');
        await triggerEvent('.hexagon-score', 'mouseleave');

        // then
        expect(find(tooltip)).to.not.exist;
      });
    });

  });
});
