import { ArchiveCertificationCentersScript } from '../../../../src/organizational-entities/scripts/archive-certification-centers-script.js';
import { expect, sinon } from '../../../test-helper.js';

describe('Unit | Organizational Entities | Scripts | Archive certification centers', function () {
  let logger;
  let script;
  let archiveCertificationCenter;

  beforeEach(function () {
    script = new ArchiveCertificationCentersScript();
    logger = { info: sinon.spy(), error: sinon.spy() };
    archiveCertificationCenter = sinon.stub();
  });

  describe('#handle', function () {
    context('when dryRun mode', function () {
      it('should return the lines that will be processed', async function () {
        // given
        const file = [
          { certificationCenterId: 1, archivedBy: 500 },
          { certificationCenterId: 2, archivedBy: 600 },
          { certificationCenterId: 3, archivedBy: 700 },
        ];

        // when
        await script.handle({
          options: {
            file,
            dryRun: true,
          },
          logger,
          archiveCertificationCenter,
        });

        // then
        expect(logger.info).to.have.been.calledWith(
          `This is a dry run. No certification centers were archived but 3 lines were processed`,
        );
      });
    });

    context('when not dryRun mode', function () {
      it('should archive successfull certification centers', async function () {
        // given
        const file = [
          { certificationCenterId: 1, archivedBy: 500 },
          { certificationCenterId: 2, archivedBy: 600 },
          { certificationCenterId: 3, archivedBy: 700 },
        ];

        // when
        await script.handle({
          options: {
            file,
            dryRun: false,
          },
          logger,
          archiveCertificationCenter,
        });

        // then
        expect(archiveCertificationCenter).to.have.been.callCount(3);
        expect(logger.info).to.have.been.calledWith('3 of 3 certification centers archived');
      });

      it('should display errors when error occurred', async function () {
        // given
        const file = [
          { certificationCenterId: 1, archivedBy: 500 },
          { certificationCenterId: 2, archivedBy: 600 },
          { certificationCenterId: 3, archivedBy: 700 },
        ];
        archiveCertificationCenter
          .withArgs({
            certificationCenterId: file[1].certificationCenterId,
            userId: file[1].archivedBy,
          })
          .rejects('No archivable');

        // when/then
        await expect(
          script.handle({
            options: {
              file,
              dryRun: false,
            },
            logger,
            archiveCertificationCenter,
          }),
        ).to.be.rejectedWith('There were 1 errors while archiving certification centers');

        // then
        expect(archiveCertificationCenter).to.have.been.callCount(3);
        expect(logger.error).to.have.been.calledWith('Error on line 1. No archivable');
      });
    });
  });
});
