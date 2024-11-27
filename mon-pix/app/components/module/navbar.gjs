import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixProgressGauge from '@1024pix/pix-ui/components/pix-progress-gauge';
import PixSidebar from '@1024pix/pix-ui/components/pix-sidebar';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import { eq } from 'ember-truth-helpers';

export default class ModulixNavbar extends Component {
  @service intl;

  get progressValue() {
    if (this.args.totalSteps <= 1) {
      return 100;
    }
    return ((this.args.currentStep - 1) / (this.args.totalSteps - 1)) * 100;
  }

  @tracked
  sidebarOpened = false;

  @action
  openSidebar() {
    this.sidebarOpened = true;
  }

  @action
  closeSidebar() {
    this.sidebarOpened = false;
  }

  get grainsWithIdAndTranslatedType() {
    return this.args.grainsToDisplay.map((grain) => ({
      type: this.intl.t(`pages.modulix.grain.tag.${grain.type}`),
      id: grain.id,
    }));
  }

  get currentGrainIndex() {
    return this.grainsWithIdAndTranslatedType.length - 1;
  }

  isActive(index) {
    return index + 1 === this.grainsWithIdAndTranslatedType.length;
  }

  @action
  onMenuItemClick(grainId) {
    this.closeSidebar();
    this.args.goToGrain(grainId);
  }

  <template>
    <nav
      class="module-navbar"
      aria-label={{t "pages.modulix.flashcards.navigation.currentStep" current=@currentStep total=@totalSteps}}
    >
      <div class="module-navbar__content">
        <PixButton
          @variant="tertiary"
          @triggerAction={{this.openSidebar}}
          aria-label={{t "pages.modulix.sidebar.button"}}
        >
          {{t "pages.modulix.flashcards.navigation.currentStep" current=@currentStep total=@totalSteps}}
        </PixButton>

        <PixProgressGauge @hidePercentage={{true}} @isDecorative={{true}} @value={{this.progressValue}} />
      </div>
    </nav>

    <PixSidebar @title={{@module.title}} @showSidebar={{this.sidebarOpened}} @onClose={{this.closeSidebar}}>
      <:content>
        <nav>
          <ul>
            {{#each this.grainsWithIdAndTranslatedType as |grain index|}}
              <li
                class="module-sidebar__list-item {{if (eq index this.currentGrainIndex) 'current-grain'}}"
                aria-current={{if (eq index this.currentGrainIndex) "step"}}
                {{on "click" (fn this.onMenuItemClick grain.id)}}
                role="link"
              >
                {{grain.type}}
              </li>
            {{/each}}
          </ul>
        </nav>
      </:content>
    </PixSidebar>
  </template>
}
