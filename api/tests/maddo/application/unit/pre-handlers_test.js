import { organizationPreHandler } from '../../../../src/maddo/application/pre-handlers.js';
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
});
