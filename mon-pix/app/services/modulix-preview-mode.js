import { action } from '@ember/object';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ModulixPreviewModeService extends Service {
  isEnabled = false;
  @tracked isElementsIdButtonEnabled = false;

  enable() {
    this.isEnabled = true;
  }

  get isPreviewAndElementsIdButtonEnabled() {
    return this.isEnabled && this.isElementsIdButtonEnabled;
  }

  @action enableElementsIdButton() {
    this.isElementsIdButtonEnabled = !this.isElementsIdButtonEnabled;
  }
}
