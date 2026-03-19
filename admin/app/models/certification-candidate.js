import { service } from '@ember/service';
import Model, { attr, hasMany } from '@ember-data/model';

export default class CertificationCandidate extends Model {
  @service intl;
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('date-only') birthdate;
  @hasMany('subscription', { async: false, inverse: null }) subscriptions;

  get subscriptionLabel() {
    const complementaryCertificationKey = this.subscriptions.filter((subscription) => subscription.isComplementary)[0]
      ?.complementaryCertificationKey;
    if (!complementaryCertificationKey) {
      return this.intl.t('pages.sessions.candidates.subscriptions.core');
    }
    if (complementaryCertificationKey == 'CLEA') {
      return this.intl.t('pages.sessions.candidates.subscriptions.dual-core-clea');
    }
    const certificationLabel = this.intl.t(
      `pages.sessions.candidates.subscriptions.certification-label.${complementaryCertificationKey}`,
    );
    if (this.subscriptions.length == 1) {
      return this.intl.t('pages.sessions.candidates.subscriptions.pix-plus', {
        certificationLabel,
      });
    }
    return this.intl.t('pages.sessions.candidates.subscriptions.complementary', {
      certificationLabel,
    });
  }
}
