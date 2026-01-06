import { ModuleDoesNotExistError } from '../../../../src/devcomp/domain/errors.js';
import { ModuleMetadata } from '../../../../src/devcomp/domain/models/module/ModuleMetadata.js';
import moduleDatasource from '../../../../src/devcomp/infrastructure/datasources/learning-content/module-datasource.js';
import * as moduleMetadataRepository from '../../../../src/devcomp/infrastructure/repositories/module-metadata-repository.js';
import { NotFoundError } from '../../../../src/shared/domain/errors.js';
import { catchErr, expect, sinon } from '../../../test-helper.js';

describe('Integration | DevComp | Repositories | ModuleRepository', function () {
  describe('#getAllByIds', function () {
    it('should return all module with their metadata', async function () {
      // given
      const modulesIds = ['f7b3a2e1-0d5c-4c6c-9c4d-1a3d8f7e9f5d', '6282925d-4775-4bca-b513-4c3009ec5886'];
      const firstModule = {
        id: modulesIds[0],
        shortId: 'gbsri73s',
        slug: 'getAllByIdsModuleSlug1',
        title: 'Bien écrire son adresse mail',
        isBeta: true,
        details: {
          image: 'https://assets.pix.org/modules/bien-ecrire-son-adresse-mail-details.svg',
          description:
            'Apprendre à rédiger correctement une adresse e-mail pour assurer une meilleure communication et éviter les erreurs courantes.',
          duration: 12,
          level: 'novice',
          tabletSupport: 'comfortable',
          objectives: [
            'Écrire une adresse mail correctement, en évitant les erreurs courantes',
            'Connaître les parties d’une adresse mail et les identifier sur des exemples',
            'Comprendre les fonctions des parties d’une adresse mail',
          ],
        },
        sections: [
          {
            id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
            type: 'practise',
            grains: [
              {
                id: 'z1f3c8c7-6d5c-4c6c-9c4d-1a3d8f7e9f5d',
                type: 'lesson',
                title: 'Explications : les parties d’une adresse mail',
                components: [
                  {
                    type: 'element',
                    element: {
                      id: 'd9e8a7b6-5c4d-3e2f-1a0b-9f8e7d6c5b4a',
                      type: 'text',
                      content:
                        "<h4 class='screen-reader-only'>L'arobase</h4><p>L’arobase est dans toutes les adresses mails. Il sépare l’identifiant et le fournisseur d’adresse mail.</p><p><span aria-hidden='true'>🇬🇧</span> En anglais, ce symbole se lit <i lang='en'>“at”</i> qui veut dire “chez”.</p><p><span aria-hidden='true'>🤔</span> Le saviez-vous : c’est un symbole qui était utilisé bien avant l’informatique ! Par exemple, pour compter des quantités.</p>",
                    },
                  },
                ],
              },
            ],
          },
        ],
      };
      const secondModule = {
        id: modulesIds[1],
        shortId: '1bdri73s',
        slug: 'getAllByIdsModuleSlug2',
        title: 'Bac à sable',
        isBeta: true,
        details: {
          image: 'https://assets.pix.org/modules/placeholder-details.svg',
          description:
            "<p>Ce module est dédié à des tests internes à Pix.</p><p>Il contient normalement l'intégralité des fonctionnalités disponibles à date.</p>",
          duration: 5,
          level: 'novice',
          tabletSupport: 'inconvenient',
          objectives: ['Non régression fonctionnelle'],
        },
        sections: [
          {
            id: 'd2ad3253-7f0a-41f5-b10e-0fa0f49d0cc7',
            type: 'practise',
            grains: [
              {
                id: 'z1f3c8c7-6d5c-4c6c-9c4d-1a3d8f7e9f5d',
                type: 'lesson',
                title: 'Explications : les parties d’une adresse mail',
                components: [
                  {
                    type: 'element',
                    element: {
                      id: 'd9e8a7b6-5c4d-3e2f-1a0b-9f8e7d6c5b4a',
                      type: 'text',
                      content:
                        "<h4 class='screen-reader-only'>L'arobase</h4><p>L’arobase est dans toutes les adresses mails. Il sépare l’identifiant et le fournisseur d’adresse mail.</p><p><span aria-hidden='true'>🇬🇧</span> En anglais, ce symbole se lit <i lang='en'>“at”</i> qui veut dire “chez”.</p><p><span aria-hidden='true'>🤔</span> Le saviez-vous : c’est un symbole qui était utilisé bien avant l’informatique ! Par exemple, pour compter des quantités.</p>",
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      const moduleDatasourceStub = {
        getAllByIds: sinon.stub(),
      };
      moduleDatasourceStub.getAllByIds.withArgs(modulesIds).resolves([firstModule, secondModule]);

      // when
      const modules = await moduleMetadataRepository.getAllByIds({
        ids: modulesIds,
        moduleDatasource: moduleDatasourceStub,
      });

      // then
      const expectedResult = [
        new ModuleMetadata({
          id: firstModule.id,
          shortId: firstModule.shortId,
          slug: firstModule.slug,
          title: firstModule.title,
          isBeta: firstModule.isBeta,
          duration: firstModule.details.duration,
          image: firstModule.details.image,
        }),
        new ModuleMetadata({
          id: secondModule.id,
          shortId: secondModule.shortId,
          slug: secondModule.slug,
          title: secondModule.title,
          isBeta: secondModule.isBeta,
          duration: secondModule.details.duration,
          image: secondModule.details.image,
        }),
      ];
      expect(modules).to.have.lengthOf(2);
      expect(modules).to.deep.equal(expectedResult);
    });

    it('should throw a "NotFoundError" when a module does not exist', async function () {
      // given
      const notExistingModuleIds = ['not-existing-module-id-1', 'not-existing-module-id-2'];
      const expectedErrorMessage = `Modules with ids not found : ${notExistingModuleIds}`;
      const moduleDatasourceStub = {
        getAllByIds: sinon.stub(),
      };
      moduleDatasourceStub.getAllByIds
        .withArgs(notExistingModuleIds)
        .rejects(new ModuleDoesNotExistError(expectedErrorMessage));

      // when
      const error = await catchErr(moduleMetadataRepository.getAllByIds)({
        ids: notExistingModuleIds,
        moduleDatasource: moduleDatasourceStub,
      });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
      expect(error.message).to.equal(expectedErrorMessage);
    });
  });

  describe('#getAllByShortIds', function () {
    it('should return all module with their metadata', async function () {
      // given
      const moduleShortIds = ['gbsri73s', '1bdri73s'];
      const firstModule = {
        id: moduleShortIds[0],
        shortId: 'gbsri73s',
        slug: 'getAllByIdsModuleSlug1',
        title: 'Bien écrire son adresse mail',
        isBeta: true,
        details: {
          image: 'https://assets.pix.org/modules/bien-ecrire-son-adresse-mail-details.svg',
          description:
            'Apprendre à rédiger correctement une adresse e-mail pour assurer une meilleure communication et éviter les erreurs courantes.',
          duration: 12,
          level: 'novice',
          tabletSupport: 'comfortable',
          objectives: [
            'Écrire une adresse mail correctement, en évitant les erreurs courantes',
            'Connaître les parties d’une adresse mail et les identifier sur des exemples',
            'Comprendre les fonctions des parties d’une adresse mail',
          ],
        },
        sections: [
          {
            id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
            type: 'practise',
            grains: [
              {
                id: 'z1f3c8c7-6d5c-4c6c-9c4d-1a3d8f7e9f5d',
                type: 'lesson',
                title: 'Explications : les parties d’une adresse mail',
                components: [
                  {
                    type: 'element',
                    element: {
                      id: 'd9e8a7b6-5c4d-3e2f-1a0b-9f8e7d6c5b4a',
                      type: 'text',
                      content:
                        "<h4 class='screen-reader-only'>L'arobase</h4><p>L’arobase est dans toutes les adresses mails. Il sépare l’identifiant et le fournisseur d’adresse mail.</p><p><span aria-hidden='true'>🇬🇧</span> En anglais, ce symbole se lit <i lang='en'>“at”</i> qui veut dire “chez”.</p><p><span aria-hidden='true'>🤔</span> Le saviez-vous : c’est un symbole qui était utilisé bien avant l’informatique ! Par exemple, pour compter des quantités.</p>",
                    },
                  },
                ],
              },
            ],
          },
        ],
      };
      const secondModule = {
        id: moduleShortIds[1],
        shortId: '1bdri73s',
        slug: 'getAllByIdsModuleSlug2',
        title: 'Bac à sable',
        isBeta: true,
        details: {
          image: 'https://assets.pix.org/modules/placeholder-details.svg',
          description:
            "<p>Ce module est dédié à des tests internes à Pix.</p><p>Il contient normalement l'intégralité des fonctionnalités disponibles à date.</p>",
          duration: 5,
          level: 'novice',
          tabletSupport: 'inconvenient',
          objectives: ['Non régression fonctionnelle'],
        },
        sections: [
          {
            id: 'd2ad3253-7f0a-41f5-b10e-0fa0f49d0cc7',
            type: 'practise',
            grains: [
              {
                id: 'z1f3c8c7-6d5c-4c6c-9c4d-1a3d8f7e9f5d',
                type: 'lesson',
                title: 'Explications : les parties d’une adresse mail',
                components: [
                  {
                    type: 'element',
                    element: {
                      id: 'd9e8a7b6-5c4d-3e2f-1a0b-9f8e7d6c5b4a',
                      type: 'text',
                      content:
                        "<h4 class='screen-reader-only'>L'arobase</h4><p>L’arobase est dans toutes les adresses mails. Il sépare l’identifiant et le fournisseur d’adresse mail.</p><p><span aria-hidden='true'>🇬🇧</span> En anglais, ce symbole se lit <i lang='en'>“at”</i> qui veut dire “chez”.</p><p><span aria-hidden='true'>🤔</span> Le saviez-vous : c’est un symbole qui était utilisé bien avant l’informatique ! Par exemple, pour compter des quantités.</p>",
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      const moduleDatasourceStub = {
        getAllByShortIds: sinon.stub(),
      };
      moduleDatasourceStub.getAllByShortIds.withArgs(moduleShortIds).resolves([firstModule, secondModule]);

      // when
      const modules = await moduleMetadataRepository.getAllByShortIds({
        shortIds: moduleShortIds,
        moduleDatasource: moduleDatasourceStub,
      });

      // then
      const expectedResult = [
        new ModuleMetadata({
          id: firstModule.id,
          shortId: firstModule.shortId,
          slug: firstModule.slug,
          title: firstModule.title,
          isBeta: firstModule.isBeta,
          duration: firstModule.details.duration,
          image: firstModule.details.image,
        }),
        new ModuleMetadata({
          id: secondModule.id,
          shortId: secondModule.shortId,
          slug: secondModule.slug,
          title: secondModule.title,
          isBeta: secondModule.isBeta,
          duration: secondModule.details.duration,
          image: secondModule.details.image,
        }),
      ];
      expect(modules).to.have.lengthOf(2);
      expect(modules).to.deep.equal(expectedResult);
    });

    it('should throw a "NotFoundError" when a module does not exist', async function () {
      // given
      const notExistingModuleShortIds = ['not-existing-module-short-id-1', 'not-existing-module-short-id-2'];
      const expectedErrorMessage = `Modules with ids not found : ${notExistingModuleShortIds}`;
      const moduleDatasourceStub = {
        getAllByShortIds: sinon.stub(),
      };
      moduleDatasourceStub.getAllByShortIds
        .withArgs(notExistingModuleShortIds)
        .rejects(new ModuleDoesNotExistError(expectedErrorMessage));

      // when
      const error = await catchErr(moduleMetadataRepository.getAllByShortIds)({
        shortIds: notExistingModuleShortIds,
        moduleDatasource: moduleDatasourceStub,
      });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
      expect(error.message).to.equal(expectedErrorMessage);
    });
  });

  describe('getByShortId', function () {
    it('should return a module with its metadata', async function () {
      const existingModuleShortId = 'gbsri73s';
      const stubModule = {
        id: 'f7b3a2e1-0d5c-4c6c-9c4d-1a3d8f7e9f5d',
        shortId: existingModuleShortId,
        slug: 'slug',
        title: 'Bien écrire son adresse mail',
        isBeta: true,
        details: {
          image: 'https://assets.pix.org/modules/bien-ecrire-son-adresse-mail-details.svg',
          description:
            'Apprendre à rédiger correctement une adresse e-mail pour assurer une meilleure communication et éviter les erreurs courantes.',
          duration: 12,
          level: 'novice',
          tabletSupport: 'comfortable',
          objectives: [
            'Écrire une adresse mail correctement, en évitant les erreurs courantes',
            'Connaître les parties d’une adresse mail et les identifier sur des exemples',
            'Comprendre les fonctions des parties d’une adresse mail',
          ],
        },
        sections: [
          {
            id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
            type: 'practise',
            grains: [
              {
                id: 'z1f3c8c7-6d5c-4c6c-9c4d-1a3d8f7e9f5d',
                type: 'lesson',
                title: 'Explications : les parties d’une adresse mail',
                components: [
                  {
                    type: 'element',
                    element: {
                      id: 'd9e8a7b6-5c4d-3e2f-1a0b-9f8e7d6c5b4a',
                      type: 'text',
                      content:
                        "<h4 class='screen-reader-only'>L'arobase</h4><p>L’arobase est dans toutes les adresses mails. Il sépare l’identifiant et le fournisseur d’adresse mail.</p><p><span aria-hidden='true'>🇬🇧</span> En anglais, ce symbole se lit <i lang='en'>“at”</i> qui veut dire “chez”.</p><p><span aria-hidden='true'>🤔</span> Le saviez-vous : c’est un symbole qui était utilisé bien avant l’informatique ! Par exemple, pour compter des quantités.</p>",
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      const moduleDatasourceStub = {
        getByShortId: sinon.stub(),
      };
      moduleDatasourceStub.getByShortId.withArgs(existingModuleShortId).resolves(stubModule);

      // when
      const moduleMetadata = await moduleMetadataRepository.getByShortId({
        shortId: existingModuleShortId,
        moduleDatasource: moduleDatasourceStub,
      });

      // then
      const expectedModuleMetadata = new ModuleMetadata({
        id: stubModule.id,
        shortId: existingModuleShortId,
        slug: stubModule.slug,
        title: stubModule.title,
        isBeta: stubModule.isBeta,
        duration: stubModule.details.duration,
        image: stubModule.details.image,
      });

      expect(moduleMetadata).to.be.instanceOf(ModuleMetadata);
      expect(moduleMetadata).to.deep.equal(expectedModuleMetadata);
    });

    it('should throw a NotFoundError if the module does not exist', async function () {
      // given
      const nonExistingShortId = 'not-existing-module-short-id';

      // when
      const error = await catchErr(moduleMetadataRepository.getByShortId)({
        slug: nonExistingShortId,
        moduleDatasource,
      });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });

  describe('#getBySlug', function () {
    it('should return a module with its metadata', async function () {
      const existingModuleSlug = 'bien-ecrire-son-adresse-mail';
      const stubModule = {
        id: 'f7b3a2e1-0d5c-4c6c-9c4d-1a3d8f7e9f5d',
        shortId: 'gbsri73s',
        slug: existingModuleSlug,
        title: 'Bien écrire son adresse mail',
        isBeta: true,
        details: {
          image: 'https://assets.pix.org/modules/bien-ecrire-son-adresse-mail-details.svg',
          description:
            'Apprendre à rédiger correctement une adresse e-mail pour assurer une meilleure communication et éviter les erreurs courantes.',
          duration: 12,
          level: 'novice',
          tabletSupport: 'comfortable',
          objectives: [
            'Écrire une adresse mail correctement, en évitant les erreurs courantes',
            'Connaître les parties d’une adresse mail et les identifier sur des exemples',
            'Comprendre les fonctions des parties d’une adresse mail',
          ],
        },
        sections: [
          {
            id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
            type: 'practise',
            grains: [
              {
                id: 'z1f3c8c7-6d5c-4c6c-9c4d-1a3d8f7e9f5d',
                type: 'lesson',
                title: 'Explications : les parties d’une adresse mail',
                components: [
                  {
                    type: 'element',
                    element: {
                      id: 'd9e8a7b6-5c4d-3e2f-1a0b-9f8e7d6c5b4a',
                      type: 'text',
                      content:
                        "<h4 class='screen-reader-only'>L'arobase</h4><p>L’arobase est dans toutes les adresses mails. Il sépare l’identifiant et le fournisseur d’adresse mail.</p><p><span aria-hidden='true'>🇬🇧</span> En anglais, ce symbole se lit <i lang='en'>“at”</i> qui veut dire “chez”.</p><p><span aria-hidden='true'>🤔</span> Le saviez-vous : c’est un symbole qui était utilisé bien avant l’informatique ! Par exemple, pour compter des quantités.</p>",
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      const moduleDatasourceStub = {
        getBySlug: sinon.stub(),
      };
      moduleDatasourceStub.getBySlug.withArgs(existingModuleSlug).resolves(stubModule);

      // when
      const moduleMetadata = await moduleMetadataRepository.getBySlug({
        slug: existingModuleSlug,
        moduleDatasource: moduleDatasourceStub,
      });

      // then
      const expectedModuleMetadata = new ModuleMetadata({
        id: stubModule.id,
        shortId: stubModule.shortId,
        slug: existingModuleSlug,
        title: stubModule.title,
        isBeta: stubModule.isBeta,
        duration: stubModule.details.duration,
        image: stubModule.details.image,
      });

      expect(moduleMetadata).to.be.instanceOf(ModuleMetadata);
      expect(moduleMetadata).to.deep.equal(expectedModuleMetadata);
    });

    it('should throw a NotFoundError if the module does not exist', async function () {
      // given
      const nonExistingModuleSlug = 'not-existing-module-slug';

      // when
      const error = await catchErr(moduleMetadataRepository.getBySlug)({
        slug: nonExistingModuleSlug,
        moduleDatasource,
      });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });
});
