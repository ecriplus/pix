import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class MembersList extends Component {
  @service featureToggles;

  get shouldDisplayRefererColumn() {
    return this.featureToggles.featureToggles.isCleaResultsRetrievalByHabilitatedCertificationCentersEnabled;
  }
}