import { FilteredOrganization } from '../../../../../../src/devcomp/domain/models/trainings/FilteredOrganization.js';
import { expect } from '../../../../../test-helper.js';

describe('Unit | Devcomp | Domain | Models | FilteredOrganization', function () {
  it('should create a FilteredOrganization object', function () {
    // given
    const organizationId = 1;
    const targetProfileTrainingId = 2;
    const type = 'SCO';
    const name = 'Orga 1';
    const externalId = 'SCO_Orga 1';

    // when
    const result = new FilteredOrganization({
      organizationId,
      targetProfileTrainingId,
      type,
      name,
      externalId,
    });

    // then
    expect(result.id).to.equal(`${targetProfileTrainingId}-${organizationId}`);
    expect(result.type).to.equal(type);
    expect(result.name).to.equal(name);
    expect(result.externalId).to.equal(externalId);
    expect(result.organizationId).to.equal(organizationId);
  });
});
