export class PixCertification {
  constructor({ pixScore, status, isCancelled, isRejectedForFraud }) {
    /**
     * @param {Object} props
     * @param {number} props.pixScore
     * @param {string} props.status
     * @param {boolean} props.isCancelled - will be removed
     * @param {boolean} props.isRejectedForFraud
     *    */
    this.pixScore = pixScore;
    this.status = status;
    this.isCancelled = isCancelled;
    this.isRejectedForFraud = isRejectedForFraud;
  }
}
