export default class BadgeAcquisitionParticipationStatistic {
  constructor({ badge, count, totalParticipationCount }) {
    this.badge = badge;
    this.count = count;
    this.percentage = totalParticipationCount === 0 ? 0 : Math.round((count / totalParticipationCount) * 100);
  }
}
