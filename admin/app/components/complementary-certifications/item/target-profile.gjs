import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import BadgesList from './target-profile/badges-list';
import History from './target-profile/history';
import Information from './target-profile/information';

export default class TargetProfile extends Component {
  @service router;
  @service store;

  @tracked complementaryCertification;
  @tracked targetProfileId;

  constructor() {
    super(...arguments);
    this.#onMount();
  }

  async #onMount() {
    const currentComplementaryCertificationId =
      this.router.currentRoute.parent.parent.params.complementary_certification_id;
    this.complementaryCertification = await this.store.peekRecord(
      'complementary-certification',
      currentComplementaryCertificationId,
    );

    this.targetProfileId = this.complementaryCertification?.currentTargetProfiles?.[0].id;
  }

  get currentTargetProfile() {
    return this.complementaryCertification?.currentTargetProfiles?.find(({ id }) => id === this.targetProfileId);
  }

  <template>
    {{#unless this.complementaryCertification.hasComplementaryReferential}}
      <Information
        @complementaryCertification={{this.complementaryCertification}}
        @currentTargetProfile={{this.currentTargetProfile}}
      />
      <BadgesList @currentTargetProfile={{this.currentTargetProfile}} />
    {{/unless}}
    <History @targetProfilesHistory={{this.complementaryCertification.targetProfilesHistory}} />
  </template>
}
