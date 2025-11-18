import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AuthenticatedAttestationsRoute extends Route {
  queryParams = {
    attestationKey: {
      refreshModel: true,
    },
    pageNumber: {
      refreshModel: true,
    },
    pageSize: {
      refreshModel: true,
    },
    statuses: {
      refreshModel: true,
    },
    divisions: {
      refreshModel: true,
    },
    search: {
      refreshModel: true,
    },
  };

  @service currentUser;
  @service router;
  @service store;

  beforeModel() {
    if (!this.currentUser.canAccessAttestationsPage) {
      this.router.replaceWith('application');
    }
  }

  async model(params) {
    const attestationKey = params.attestationKey ?? this.currentUser.prescriber.availableAttestations[0];
    const organizationId = this.currentUser.organization.id;
    const attestationParticipantStatuses = await this.store.query('attestation-participant-status', {
      organizationId,
      attestationKey,
      filter: {
        statuses: params.statuses,
        divisions: params.divisions,
        search: params.search,
      },
      page: {
        number: params.pageNumber,
        size: params.pageSize,
      },
    });

    if (this.currentUser.organization.isManagingStudents) {
      const divisions = await this.currentUser.organization.divisions;
      const options = divisions.map(({ name }) => ({ label: name, value: name }));
      return { options, attestationParticipantStatuses, attestationKey };
    }

    return { attestationParticipantStatuses, attestationKey };
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.statuses = [];
      controller.divisions = [];
      controller.search = null;
      controller.pageSize = 50;
      controller.pageNumber = 1;
      controller.attestationKey = null;
    }
  }

  @action
  refreshModel() {
    this.refresh();
  }

  @action
  loading() {
    return false;
  }
}
