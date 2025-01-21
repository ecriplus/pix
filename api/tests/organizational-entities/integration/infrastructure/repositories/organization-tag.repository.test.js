import lodash from 'lodash';

import * as organizationTagRepository from '../../../../../src/organizational-entities/infrastructure/repositories/organization-tag.repository.js';
import { AlreadyExistingEntityError } from '../../../../../src/shared/domain/errors.js';
import { OrganizationTag } from '../../../../../src/shared/domain/models/OrganizationTag.js';
import { catchErr, databaseBuilder, domainBuilder, expect, knex } from '../../../../test-helper.js';
const { omit } = lodash;

describe('Integration | Organizational Entities | Infrastructure | Repository | OrganizationTagRepository', function () {
  describe('#create', function () {
    it('creates an OrganizationTag', async function () {
      // given
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const tagId = databaseBuilder.factory.buildTag().id;
      await databaseBuilder.commit();
      const organizationTag = domainBuilder.buildOrganizationTag({ organizationId, tagId });

      // when
      const createdOrganizationTag = await organizationTagRepository.create(organizationTag);

      // then
      expect(createdOrganizationTag).to.be.instanceOf(OrganizationTag);
      expect(omit(createdOrganizationTag, 'id')).to.deep.equal(omit(organizationTag, 'id'));
    });

    context('when an organization tag already exist', function () {
      it('throws an AlreadyExistingEntityError', async function () {
        // given
        const existingOrganizationTag = databaseBuilder.factory.buildOrganizationTag();
        await databaseBuilder.commit();

        // when
        const error = await catchErr(organizationTagRepository.create)({
          organizationId: existingOrganizationTag.organizationId,
          tagId: existingOrganizationTag.tagId,
        });

        // then
        expect(error).to.be.an.instanceof(AlreadyExistingEntityError);
      });
    });
  });

  describe('#isExistingByOrganizationIdAndTagId', function () {
    it('returns true if organization tag exists', async function () {
      // given
      const existingOrganizationTag = databaseBuilder.factory.buildOrganizationTag();
      await databaseBuilder.commit();

      // when
      const isExisting = await organizationTagRepository.isExistingByOrganizationIdAndTagId({
        organizationId: existingOrganizationTag.organizationId,
        tagId: existingOrganizationTag.tagId,
      });

      // then
      expect(isExisting).to.be.true;
    });

    it('returns false if organization tag does not exist', async function () {
      // given
      const notExistingId = 1234;

      // when
      const isExisting = await organizationTagRepository.isExistingByOrganizationIdAndTagId({
        organizationId: notExistingId,
        tagId: notExistingId,
      });

      // then
      expect(isExisting).to.be.false;
    });
  });

  describe('#batchCreate', function () {
    it('adds rows in the table "organizations-tags"', async function () {
      // given
      const organizationId1 = databaseBuilder.factory.buildOrganization().id;
      const organizationId2 = databaseBuilder.factory.buildOrganization().id;

      const tagId1 = databaseBuilder.factory.buildTag({ name: 'tag1' }).id;
      const tagId2 = databaseBuilder.factory.buildTag({ name: 'tag2' }).id;

      await databaseBuilder.commit();

      const organizationTag1 = domainBuilder.buildOrganizationTag({ organizationId: organizationId1, tagId: tagId1 });
      const organizationTag2 = domainBuilder.buildOrganizationTag({ organizationId: organizationId2, tagId: tagId2 });
      organizationTag1.id = undefined;
      organizationTag2.id = undefined;

      // when
      await organizationTagRepository.batchCreate([organizationTag1, organizationTag2]);

      // then
      const foundOrganizations = await knex('organization-tags').select();
      expect(foundOrganizations).to.have.lengthOf(2);
    });
  });

  describe('#deleteTag', function () {
    it('delete organizationTags', async function () {
      // given
      const organization1 = databaseBuilder.factory.buildOrganization();
      const organization2 = databaseBuilder.factory.buildOrganization();
      const tag1 = databaseBuilder.factory.buildTag({ name: 'tag1' });
      const tag2 = databaseBuilder.factory.buildTag({ name: 'tag2' });
      databaseBuilder.factory.buildOrganizationTag({
        organizationId: organization1.id,
        tagId: tag1.id,
      });
      databaseBuilder.factory.buildOrganizationTag({
        organizationId: organization2.id,
        tagId: tag2.id,
      });
      databaseBuilder.factory.buildOrganizationTag({
        organizationId: organization1.id,
        tagId: tag2.id,
      });
      await databaseBuilder.commit();
      // when
      await organizationTagRepository.deleteTagsByOrganizationId(organization1.id);
      // then
      const organizationTags = await knex('organization-tags').select();
      expect(organizationTags).to.have.lengthOf(1);
      expect(organizationTags[0]).to.have.property('tagId', tag2.id);
      expect(organizationTags[0]).to.have.property('organizationId', organization2.id);
    });
  });
});
