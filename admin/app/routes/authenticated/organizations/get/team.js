import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class OrganizationTeamRoute extends Route {
  @service router;
  @service pixToast;
  @service store;

  queryParams = {
    pageNumber: { refreshModel: true },
    pageSize: { refreshModel: true },
    firstName: { refreshModel: true },
    lastName: { refreshModel: true },
    email: { refreshModel: true },
    organizationRole: { refreshModel: true },
  };

  ERROR_MESSAGES = {
    DEFAULT: 'Une erreur est survenue.',
    STATUS_403: "Vous n'avez pas accès à certaines actions ou informations de cette page",
  };

  beforeModel() {
    const organization = this.modelFor('authenticated.organizations.get');
    if (organization.isArchived) {
      return this.router.replaceWith('authenticated.organizations.get.details');
    }
  }

  async model(params) {
    const organization = this.modelFor('authenticated.organizations.get');
    let organizationMemberships = [];
    try {
      organizationMemberships = await this.store.query('organization-membership', {
        filter: {
          organizationId: organization.id,
          firstName: params.firstName,
          lastName: params.lastName,
          email: params.email,
          organizationRole: params.organizationRole,
        },
        page: { size: params.pageSize, number: params.pageNumber },
      });
    } catch (errorResponse) {
      this._handleResponseError(errorResponse);
    }

    return { organization, organizationMemberships };
  }

  @action
  refreshModel() {
    this.refresh();
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.pageNumber = 1;
      controller.pageSize = 10;
      controller.firstName = null;
      controller.lastName = null;
      controller.email = null;
      controller.organizationRole = null;
    }
  }

  _handleResponseError(errorResponse) {
    const { errors } = errorResponse;

    if (errors) {
      errors.map((error) => {
        switch (error.code) {
          case 403:
            this.pixToast.sendErrorNotification({ message: this.ERROR_MESSAGES.STATUS_403 });
            break;
          default:
            this.pixToast.sendErrorNotification({ message: this.ERROR_MESSAGES.DEFAULT });
            break;
        }
      });
    } else {
      this.pixToast.sendErrorNotification({ message: this.ERROR_MESSAGES.DEFAULT });
    }
  }
}
