import { ModuleMetadata } from '../../../../../src/devcomp/domain/models/module/ModuleMetadata.js';
import { getModuleMetadataList } from '../../../../../src/devcomp/domain/usecases/get-module-metadata-list.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, expect, sinon } from '../../../../test-helper.js';

describe('Unit | Devcomp | Domain | UseCases | get-module-metadata-list', function () {
  let firstModule, secondModule, modules;

  beforeEach(function () {
    firstModule = {
      id: 'f7b3a2e1-0d5c-4c6c-9c4d-1a3d8f7e9f5d',
      slug: 'getAllByIdsModuleSlug1',
      title: 'Bien écrire son adresse mail',
      isBeta: true,
      details: {
        image: 'https://images.pix.fr/modulix/bien-ecrire-son-adresse-mail-details.svg',
        description:
          'Apprendre à rédiger correctement une adresse e-mail pour assurer une meilleure communication et éviter les erreurs courantes.',
        duration: 12,
        level: 'Débutant',
        tabletSupport: 'comfortable',
        objectives: [
          'Écrire une adresse mail correctement, en évitant les erreurs courantes',
          'Connaître les parties d’une adresse mail et les identifier sur des exemples',
          'Comprendre les fonctions des parties d’une adresse mail',
        ],
      },
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
    };
    secondModule = {
      id: '6282925d-4775-4bca-b513-4c3009ec5886',
      slug: 'getAllByIdsModuleSlug2',
      title: 'Bac à sable',
      isBeta: true,
      details: {
        image: 'https://assets.pix.org/modules/placeholder-details.svg',
        description:
          "<p>Ce module est dédié à des tests internes à Pix.</p><p>Il contient normalement l'intégralité des fonctionnalités disponibles à date.</p>",
        duration: 5,
        level: 'Débutant',
        tabletSupport: 'inconvenient',
        objectives: ['Non régression fonctionnelle'],
      },
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
    };
    modules = [firstModule, secondModule];
  });

  it('should get and return a list of ModuleMetadata', async function () {
    // given
    const ids = [modules[0].id, modules[1].id];
    const moduleRepository = {
      getAllByIds: sinon.stub(),
    };
    moduleRepository.getAllByIds.withArgs({ ids }).resolves(modules);

    // when
    const moduleMetadataList = await getModuleMetadataList({ ids, moduleRepository });

    // then
    const expectedModuleMetadataList = [
      new ModuleMetadata({
        id: firstModule.id,
        slug: firstModule.slug,
        title: firstModule.title,
        isBeta: firstModule.isBeta,
        duration: firstModule.details.duration,
      }),
      new ModuleMetadata({
        id: secondModule.id,
        slug: secondModule.slug,
        title: secondModule.title,
        isBeta: secondModule.isBeta,
        duration: secondModule.details.duration,
      }),
    ];
    expect(moduleMetadataList).to.deep.equal(expectedModuleMetadataList);
  });

  context('when a module id does not exist', function () {
    it('should throw the NotFoundError thrown by repository', async function () {
      // given
      const ids = ['notFoundModuleId1', 'notFoundModuleId2'];
      const moduleRepository = {
        getAllByIds: sinon.stub(),
      };
      moduleRepository.getAllByIds.withArgs({ ids }).throws(new NotFoundError());

      // when
      const error = await catchErr(getModuleMetadataList)({ ids, moduleRepository });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });
});
