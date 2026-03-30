import { action } from '@ember/object';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ModulixPreviewModeService extends Service {
  isEnabled = false;
  @tracked isElementsIdButtonEnabled = true;

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  get isPreviewAndElementsIdButtonEnabled() {
    return this.isEnabled && this.isElementsIdButtonEnabled;
  }

  @action toggleElementIdButton() {
    this.isElementsIdButtonEnabled = !this.isElementsIdButtonEnabled;
  }
}
