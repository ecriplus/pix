import Component from '@glimmer/component';

export default class Index extends Component {
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
