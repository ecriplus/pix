import * as administrationTeamRepository from '../../../../../src/organizational-entities/infrastructure/repositories/administration-team-repository.js';
import { databaseBuilder, domainBuilder, expect } from '../../../../test-helper.js';

describe('Integration | Repository | administration-team-repository', function () {
  describe('#findAll', function () {
    it('should return all administration teams ordered by name', async function () {
      // given
      const firstAdministrationTeam = databaseBuilder.factory.buildAdministrationTeam({
        name: 'Équipe B',
        createdAt: new Date('2020-01-01'),
      });
      const secondAdministrationTeam = databaseBuilder.factory.buildAdministrationTeam({
        name: 'Équipe A',
        createdAt: new Date('2021-01-02'),
      });
      await databaseBuilder.commit();

      // when
      const result = await administrationTeamRepository.findAll();

      // then
      expect(result).to.have.deep.members([
        domainBuilder.buildAdministrationTeam({ id: secondAdministrationTeam.id, name: 'Équipe A' }),
        domainBuilder.buildAdministrationTeam({ id: firstAdministrationTeam.id, name: 'Équipe B' }),
      ]);
    });

    it('should return an empty array if there is no pix team', async function () {
      // when
      const result = await administrationTeamRepository.findAll();

      // then
      expect(result).to.deep.equal([]);
    });
  });
});
