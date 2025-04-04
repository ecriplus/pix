import _ from 'lodash';

import { CenterForAdmin } from '../../../../../src/organizational-entities/domain/models/CenterForAdmin.js';
import * as CertificationCenterForAdminRepository from '../../../../../src/organizational-entities/infrastructure/repositories/certification-center-for-admin.repository.js';
import { databaseBuilder, expect, knex, sinon } from '../../../../test-helper.js';

describe('Integration | Organizational Entities | Infrastructure | Repository | certification-center-for-admin', function () {
  let clock;
  const now = new Date('2021-11-16');

  beforeEach(function () {
    clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
  });

  afterEach(function () {
    clock.restore();
  });

  describe('#save', function () {
    it('saves the given certification center', async function () {
      // given
      const certificationCenterId = 1;
      const certificationCenterName = 'CertificationCenterName';
      const certificationCenterType = 'SCO';

      const center = databaseBuilder.factory.buildCertificationCenter({
        id: certificationCenterId,
        name: certificationCenterName,
        type: certificationCenterType,
      });

      const certificationCenterForAdmin = new CenterForAdmin({
        center,
      });

      // when
      const savedCertificationCenter = await CertificationCenterForAdminRepository.save(certificationCenterForAdmin);

      // then
      expect(savedCertificationCenter).to.be.instanceof(CenterForAdmin);
      expect(savedCertificationCenter.id).to.exist;
      expect(savedCertificationCenter.name).to.equal(certificationCenterName);
      expect(savedCertificationCenter.type).to.equal(certificationCenterType);
    });
  });

  describe('#update', function () {
    let center;

    before(async function () {
      // given
      center = databaseBuilder.factory.buildCertificationCenter();
      await databaseBuilder.commit();
    });

    it('updates the given certification center', async function () {
      // when
      await CertificationCenterForAdminRepository.update({
        id: center.id,
        name: 'Great Oak Certification Center',
        updatedAt: now,
      });

      // then
      const updatedCertificationCenter = await knex('certification-centers').select().where({ id: center.id }).first();
      expect(_.omit(updatedCertificationCenter, 'isV3Pilot')).to.deep.equal({
        ...center,
        name: 'Great Oak Certification Center',
        updatedAt: updatedCertificationCenter.updatedAt,
      });
    });
  });
});
