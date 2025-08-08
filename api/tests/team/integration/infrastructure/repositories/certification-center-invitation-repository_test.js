import { CertificationCenterInvitation } from '../../../../../src/team/domain/models/CertificationCenterInvitation.js';
import * as certificationCenterInvitationRepository from '../../../../../src/team/infrastructure/repositories/certification-center-invitation-repository.js';
import { databaseBuilder, domainBuilder, expect, knex, sinon } from '../../../../test-helper.js';

describe('Integration | Team | Infrastructure | Repositories | CertificationCenterInvitationRepository', function () {
  let clock, now;

  beforeEach(function () {
    now = new Date('2023-10-13');
    clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
  });

  afterEach(function () {
    clock.restore();
  });

  describe('#update', function () {
    it('updates invitation', async function () {
      // given
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
      const invitation = databaseBuilder.factory.buildCertificationCenterInvitation({
        certificationCenterId,
        role: 'MEMBER',
        locale: 'fr',
      });
      await databaseBuilder.commit();
      // when
      await certificationCenterInvitationRepository.update({
        ...invitation,
        role: 'ADMIN',
        locale: 'EN',
      });

      // then
      const updatedInvitation = await knex('certification-center-invitations').where({ id: invitation.id }).first();
      expect(updatedInvitation).to.deep.equal({
        id: invitation.id,
        email: invitation.email,
        code: invitation.code,
        role: 'ADMIN',
        locale: 'EN',
        certificationCenterId,
        status: CertificationCenterInvitation.StatusType.PENDING,
        createdAt: invitation.createdAt,
        updatedAt: now,
      });
      clock.restore();
    });
  });

  describe('#updateModificationDate', function () {
    it('updates the certification center invitation modification date', async function () {
      // given
      const certificationCenter = databaseBuilder.factory.buildCertificationCenter();
      const certificationCenterInvitation = databaseBuilder.factory.buildCertificationCenterInvitation({
        certificationCenterId: certificationCenter.id,
        createdAt: new Date('2023-10-10'),
        updatedAt: new Date('2023-10-10'),
      });

      await databaseBuilder.commit();

      // when
      await certificationCenterInvitationRepository.updateModificationDate(certificationCenterInvitation.id);

      // then
      const updatedCertificationCenterInvitation = await knex('certification-center-invitations')
        .where({ id: certificationCenterInvitation.id })
        .first();
      expect(updatedCertificationCenterInvitation.updatedAt).to.deep.equal(now);
      clock.restore();
    });
  });

  describe('#markAsCancelledByCertificationCenter', function () {
    it('cancels all pending invitations of a given certification center', async function () {
      // given
      const previousUpdate = new Date(2020, 10, 31);
      const cancelDate = new Date(2021, 10, 31);
      const pendingStatus = CertificationCenterInvitation.StatusType.PENDING;
      const cancelledStatus = CertificationCenterInvitation.StatusType.CANCELLED;
      const acceptedStatus = CertificationCenterInvitation.StatusType.ACCEPTED;

      const thisCertificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
      const otherCertificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;

      databaseBuilder.factory.buildCertificationCenterInvitation({
        certificationCenterId: thisCertificationCenterId,
        status: pendingStatus,
        updatedAt: previousUpdate,
      });
      databaseBuilder.factory.buildCertificationCenterInvitation({
        certificationCenterId: thisCertificationCenterId,
        status: acceptedStatus,
        updatedAt: previousUpdate,
      });
      databaseBuilder.factory.buildCertificationCenterInvitation({
        certificationCenterId: thisCertificationCenterId,
        status: cancelledStatus,
        updatedAt: previousUpdate,
      });

      databaseBuilder.factory.buildCertificationCenterInvitation({
        certificationCenterId: otherCertificationCenterId,
        status: pendingStatus,
        updatedAt: previousUpdate,
      });

      await databaseBuilder.commit();

      // when
      await certificationCenterInvitationRepository.markAsCancelledByCertificationCenter({
        certificationCenterId: thisCertificationCenterId,
        updatedAt: cancelDate,
      });

      // then
      const thisCenterPendingInvitations = await knex('certification-center-invitations').where({
        certificationCenterId: thisCertificationCenterId,
        status: pendingStatus,
      });
      expect(thisCenterPendingInvitations).to.have.lengthOf(0);

      const allCancelledInvitationsOfThisCenter = await knex('certification-center-invitations').where({
        certificationCenterId: thisCertificationCenterId,
        status: cancelledStatus,
      });
      expect(allCancelledInvitationsOfThisCenter).to.have.lengthOf(2);

      const newlyCancelledInvitations = await knex('certification-center-invitations').where({
        status: cancelledStatus,
        updatedAt: cancelDate,
      });
      expect(newlyCancelledInvitations).to.have.lengthOf(1);

      const acceptedInvitations = await knex('certification-center-invitations').where({
        certificationCenterId: thisCertificationCenterId,
        status: acceptedStatus,
      });
      expect(acceptedInvitations).to.have.lengthOf(1);

      const otherCenterInvitation = await knex('certification-center-invitations')
        .where({
          certificationCenterId: otherCertificationCenterId,
        })
        .first();
      expect(otherCenterInvitation.status).to.equal(pendingStatus);
      expect(otherCenterInvitation.updatedAt).to.deep.equal(previousUpdate);
    });
  });

  describe('#findOnePendingByEmailAndCertificationCenterId', function () {
    it('returns null if no pending invitation exists for the given email and certification center id', async function () {
      // given
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
      const email = 'toto@example.net';

      // when
      const result = await certificationCenterInvitationRepository.findOnePendingByEmailAndCertificationCenterId({
        email,
        certificationCenterId,
      });

      // then
      expect(result).to.be.null;
    });

    it('returns the pending invitation for the given email and certification center id', async function () {
      // given
      const certificationCenter = databaseBuilder.factory.buildCertificationCenter();
      const email = 'toto@example.net';
      const certificationCenterInvitation = databaseBuilder.factory.buildCertificationCenterInvitation({
        certificationCenterId: certificationCenter.id,
        email,
        status: CertificationCenterInvitation.StatusType.PENDING,
      });
      await databaseBuilder.commit();

      const expectedInvitation = domainBuilder.buildCertificationCenterInvitation({
        id: certificationCenterInvitation.id,
        certificationCenterId: certificationCenter.id,
        certificationCenterName: certificationCenter.name,
        status: CertificationCenterInvitation.StatusType.PENDING,
        ...certificationCenterInvitation,
      });

      // when
      const result = await certificationCenterInvitationRepository.findOnePendingByEmailAndCertificationCenterId({
        email,
        certificationCenterId: certificationCenter.id,
      });

      // then
      expect(result).to.deep.equal(expectedInvitation);
    });
  });
});
