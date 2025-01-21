import { DeleteOrganizationsScript } from '../../../../src/organizational-entities/scripts/./delete-organizations-script.js';
import { expect, sinon } from '../../../test-helper.js';

describe('DeleteOrganizationsScript', function () {
  describe('Handle', function () {
    let script;
    let logger;
    let organizationForAdminRepository;
    let organizationTagRepository;
    let dataProtectionOfficerRepository;

    beforeEach(function () {
      script = new DeleteOrganizationsScript();
      logger = { info: sinon.spy() };
      organizationForAdminRepository = { deleteById: sinon.stub() };
      organizationTagRepository = { deleteTagsByOrganizationId: sinon.stub() };
      dataProtectionOfficerRepository = { deleteDpoByOrganizationId: sinon.stub() };
    });

    it('handles data correctly', async function () {
      const file = [{ 'Organization ID': 1 }, { 'Organization ID': 2 }];

      await script.handle({
        options: { file },
        logger,
        dependencies: {
          organizationForAdminRepository,
          organizationTagRepository,
          dataProtectionOfficerRepository,
        },
      });
      expect(organizationForAdminRepository.deleteById.calledWith(1)).to.be.true;
      expect(organizationForAdminRepository.deleteById.calledWith(2)).to.be.true;
      expect(organizationTagRepository.deleteTagsByOrganizationId.calledWith(1)).to.be.true;
      expect(organizationTagRepository.deleteTagsByOrganizationId.calledWith(2)).to.be.true;
      expect(dataProtectionOfficerRepository.deleteDpoByOrganizationId.calledWith(1)).to.be.true;
      expect(dataProtectionOfficerRepository.deleteDpoByOrganizationId.calledWith(2)).to.be.true;
    });
  });
});
