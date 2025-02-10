export default class BadgeAcquisitionParticipationStatistic {
  constructor({ badge, count, totalParticipationCount }) {
    this.badge = badge;
    this.count = count;
    this.totalParticipationCount = totalParticipationCount;
  }

  get percentage() {
    return this.totalParticipationCount === 0 ? 0 : Math.round((this.count / this.totalParticipationCount) * 100);
  }
}
