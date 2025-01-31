import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import didRender from '../modifiers/did-render';

const ROBOT_IMAGE_OFFSET = 52;

export default class RobotDialog extends Component {
  @tracked resizeObserver;

  @action
  observeResize() {
    const bubbles = window.document.querySelector('.bubbles');
    this.resizeObserver = new ResizeObserver(([entries]) => {
      this.positionRobot(entries.contentRect.height);
    });
    this.resizeObserver.observe(bubbles);
  }

  get getRobotImageUrl() {
    return `/images/robot/dialog-robot-${this.args.class ? this.args.class : 'default'}.svg`;
  }

  positionRobot(bubblesHeight) {
    const robotImage = window.document.querySelector('.robot-speaking__logo');
    if (robotImage) {
      robotImage.style.transition = `all 0.4s ease-in-out`;
      robotImage.style.transform = `translateY(${bubblesHeight - (this.args.robotOffSet || ROBOT_IMAGE_OFFSET)}px)`;
    }
  }

  <template>
    <div class="robot-speaking">
      <img class="robot-speaking__logo" alt="mascotte pix1d" src={{this.getRobotImageUrl}} />
      <div class="bubbles" {{didRender this.observeResize}}>
        {{yield}}
      </div>
    </div>
  </template>
}
