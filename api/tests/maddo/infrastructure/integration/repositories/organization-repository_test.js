import { findIdsByTagNames } from '../../../../../src/maddo/infrastructure/repositories/organization-repository.js';
import { databaseBuilder, expect } from '../../../../test-helper.js';

describe('Maddo | Infrastructure | Repositories | Integration | organization', function () {
  describe('#findIdsByTagNames', function () {
    it('lists organizations ids belonging to all given tag names', async function () {
      // given
      const { id: organizationId1 } = databaseBuilder.factory.buildOrganization();
      const { id: organizationId2 } = databaseBuilder.factory.buildOrganization();
      const { id: organizationId3 } = databaseBuilder.factory.buildOrganization();
      const { id: organizationId4 } = databaseBuilder.factory.buildOrganization();
      const { id: organizationId5 } = databaseBuilder.factory.buildOrganization();

      const { id: tagId1 } = databaseBuilder.factory.buildTag({ name: 'tag1' });
      const { id: tagId2 } = databaseBuilder.factory.buildTag({ name: 'tag2' });
      const { id: tagId3 } = databaseBuilder.factory.buildTag({ name: 'tag3' });

      databaseBuilder.factory.buildOrganizationTag({ organizationId: organizationId1, tagId: tagId1 });
      databaseBuilder.factory.buildOrganizationTag({ organizationId: organizationId1, tagId: tagId3 });
      databaseBuilder.factory.buildOrganizationTag({ organizationId: organizationId2, tagId: tagId2 });
      databaseBuilder.factory.buildOrganizationTag({ organizationId: organizationId3, tagId: tagId1 });
      databaseBuilder.factory.buildOrganizationTag({ organizationId: organizationId4, tagId: tagId3 });
      databaseBuilder.factory.buildOrganizationTag({ organizationId: organizationId5, tagId: tagId1 });
      databaseBuilder.factory.buildOrganizationTag({ organizationId: organizationId5, tagId: tagId2 });
      databaseBuilder.factory.buildOrganizationTag({ organizationId: organizationId5, tagId: tagId3 });

      await databaseBuilder.commit();

      const tagNames = ['tag1', 'tag3'];

      // when
      const ids = await findIdsByTagNames(tagNames);

      // then
      expect(ids).to.deep.equal([organizationId1, organizationId5]);
    });
  });
});
