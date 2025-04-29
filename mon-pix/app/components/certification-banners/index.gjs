import Component from '@glimmer/component';
import gt from 'ember-truth-helpers/helpers/gt';
import CongratulationsCertificationBanner from 'mon-pix/components/certification-banners/congratulations-certification-banner';
import EligibleComplementaryCertificationBanner from 'mon-pix/components/certification-banners/eligible-complementary-certification-banner';
import OutdatedComplementaryCertificationBanner from 'mon-pix/components/certification-banners/outdated-complementary-certification-banner';

export default class Index extends Component {
  <template>
    <CongratulationsCertificationBanner @fullName={{@fullName}}>
      <:eligibleComplementaryCertifications>
        {{#if (gt this.eligibleComplementaryCertifications.length 0)}}
          <EligibleComplementaryCertificationBanner
            @complementaryCertifications={{this.eligibleComplementaryCertifications}}
          />
        {{/if}}
      </:eligibleComplementaryCertifications>
    </CongratulationsCertificationBanner>

    {{#if (gt this.outdatedLowerLevelComplementaryCertifications.length 0)}}
      <OutdatedComplementaryCertificationBanner
        @complementaryCertifications={{this.outdatedLowerLevelComplementaryCertifications}}
      />
    {{/if}}
  </template>
  get eligibleComplementaryCertifications() {
    return (
      this.args.certificationEligibility.complementaryCertifications?.filter(
        (complementaryCertification) => !complementaryCertification.isOutdated,
      ) ?? []
    );
  }

  get outdatedLowerLevelComplementaryCertifications() {
    return (
      this.args.certificationEligibility.complementaryCertifications?.filter(
        (complementaryCertification) =>
          complementaryCertification.isOutdated && !complementaryCertification.isAcquiredExpectedLevel,
      ) ?? []
    );
  }
}
