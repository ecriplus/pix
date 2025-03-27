import boom from '@hapi/boom';

import {
  isOrganizationInJurisdictionPreHandler,
  organizationPreHandler,
} from '../../../../src/maddo/application/pre-handlers.js';
import { expect, hFake, sinon } from '../../../test-helper.js';

describe('Unit | Maddo | Application | pre handlers', function () {
  describe('#organizationPreHandler', function () {
    it('returns allowed organizations ids for authentified client application', async function () {
      // given
      const request = {
        auth: {
          credentials: {
            client_id: 'client_id',
          },
        },
      };

      const findOrganizationIdsByClientApplication = sinon.stub();
      findOrganizationIdsByClientApplication.withArgs({ clientId: 'client_id' }).resolves(['orga1', 'orga2']);

      // when
      const organizationIds = await organizationPreHandler.method(request, hFake, {
        findOrganizationIdsByClientApplication,
      });

      // then
      expect(organizationIds).to.deep.equal(['orga1', 'orga2']);
    });
  });

  describe('#isOrganizationInJurisdictionPreHandler', function () {
    it('calls continue when organization belongs to jurisdiction', function () {
      // given
      const request = {
        pre: {
          organizationIds: ['orgaInJuridictionId'],
        },
        params: {
          organizationId: 'orgaInJuridictionId',
        },
      };

      // when
      const prehandlerResult = isOrganizationInJurisdictionPreHandler.method(request, hFake);

      // then
      expect(prehandlerResult).to.equal(hFake.continue);
    });

    it('returns forbidden when organization does not belong to jurisdiction', function () {
      // given
      const request = {
        pre: {
          organizationIds: ['orgaInJuridictionId'],
        },
        params: {
          organizationId: 'orgaNotInJuridictionId',
        },
      };

      // when
      const prehandlerResult = isOrganizationInJurisdictionPreHandler.method(request, hFake);

      // then
      expect(prehandlerResult).to.deep.equal(boom.forbidden());
    });

    it('returns forbidden when jurisdiction has not been resolved before', function () {
      // given
      const request = {
        params: {
          organizationId: 'orgaNotInJuridictionId',
        },
      };

      // when
      const prehandlerResult = isOrganizationInJurisdictionPreHandler.method(request, hFake);

      // then
      expect(prehandlerResult).to.deep.equal(boom.forbidden());
    });
  });
});
