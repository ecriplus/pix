import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export const SIXTH_GRADE_ATTESTATION_KEY = 'SIXTH_GRADE';
export const FILE_NAME = 'attestations';

export default class AuthenticatedAttestationsController extends Controller {
  @service fileSaver;
  @service session;
  @service currentUser;
  @service pixMetrics;
  @service notifications;
  @service intl;

  @action
  async downloadAttestations(attestationKey, selectedDivisions) {
    try {
      this.sendMetrics();
      let url;
      const organizationId = this.currentUser.organization.id;
      const baseUrl = `/api/organizations/${organizationId}/attestations/${attestationKey}`;
      if (selectedDivisions.length > 0) {
        const formatedDivisionsForQuery = selectedDivisions
          .map((division) => `divisions[]=${encodeURIComponent(division)}`)
          .join('&');

        url = baseUrl + `?${formatedDivisionsForQuery}`;
      } else {
        url = baseUrl;
      }

      const token = this.session.isAuthenticated ? this.session.data.authenticated.access_token : '';

      const noAttestationMessageNotification = this.intl.t('pages.attestations.no-attestations');

      await this.fileSaver.save({
        url,
        token,
        fileName: FILE_NAME,
        noContentMessageNotification: noAttestationMessageNotification,
      });
    } catch (error) {
      this.notifications.sendError(error.message, { autoClear: false });
    }
  }

  sendMetrics() {
    this.pixMetrics.trackEvent({
      event: 'custom-event',
      'pix-event-category': 'Attestations',
      'pix-event-action': 'Cliquer sur le bouton Télécharger sur la page Attestations',
      'pix-event-name': 'Clic sur le bouton Télécharger (attestations)',
    });
  }
}
