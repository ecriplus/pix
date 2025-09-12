import { ModuleInstantiationError } from '../../../../../src/devcomp/domain/errors.js';
import { ComponentStepper } from '../../../../../src/devcomp/domain/models/component/ComponentStepper.js';
import { Step } from '../../../../../src/devcomp/domain/models/component/Step.js';
import { CustomDraft } from '../../../../../src/devcomp/domain/models/element/CustomDraft.js';
import { CustomElement } from '../../../../../src/devcomp/domain/models/element/CustomElement.js';
import { Download } from '../../../../../src/devcomp/domain/models/element/Download.js';
import { Embed } from '../../../../../src/devcomp/domain/models/element/Embed.js';
import { Image } from '../../../../../src/devcomp/domain/models/element/Image.js';
import { QAB } from '../../../../../src/devcomp/domain/models/element/qab/QAB.js';
import { QCM } from '../../../../../src/devcomp/domain/models/element/QCM.js';
import { QCU } from '../../../../../src/devcomp/domain/models/element/QCU.js';
import { QCUDeclarative } from '../../../../../src/devcomp/domain/models/element/QCU-declarative.js';
import { QCUDiscovery } from '../../../../../src/devcomp/domain/models/element/QCU-discovery.js';
import { QROCM } from '../../../../../src/devcomp/domain/models/element/QROCM.js';
import { Separator } from '../../../../../src/devcomp/domain/models/element/Separator.js';
import { Text } from '../../../../../src/devcomp/domain/models/element/Text.js';
import { Video } from '../../../../../src/devcomp/domain/models/element/Video.js';
import { Grain } from '../../../../../src/devcomp/domain/models/Grain.js';
import { Module } from '../../../../../src/devcomp/domain/models/module/Module.js';
import { ModuleFactory } from '../../../../../src/devcomp/infrastructure/factories/module-factory.js';
import { logger } from '../../../../../src/shared/infrastructure/utils/logger.js';
import { catchErr, expect, sinon } from '../../../../test-helper.js';
import { validateFlashcards } from '../../../shared/validateFlashcards.js';

describe('Integration | Devcomp | Infrastructure | Factories | Module ', function () {
  describe('#toDomain', function () {
    describe('when data is incorrect', function () {
      describe('when a component has an unknown type', function () {
        it('should log the error', async function () {
          // given
          const moduleData = {
            id: '6282925d-4775-4bca-b513-4c3009ec5886',
            slug: 'title',
            title: 'title',
            isBeta: true,
            details: {
              image: 'https://images.pix.fr/modulix/placeholder-details.svg',
              description: 'Description',
              duration: 5,
              level: 'novice',
              tabletSupport: 'comfortable',
              objectives: ['Objective 1'],
            },
            sections: [
              {
                id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
                type: 'practise',
                grains: [
                  {
                    id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                    type: 'lesson',
                    title: 'title',
                    components: [
                      {
                        type: 'unknown',
                        element: {
                          id: '8d7687c8-4a02-4d7e-bf6c-693a6d481c78',
                          type: 'text',
                          content: '<p>content</p>',
                          alt: 'Alternative',
                          alternativeText: 'Alternative textuelle',
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          };
          sinon.stub(logger, 'warn').returns();

          // when
          await ModuleFactory.build(moduleData);

          // then
          expect(logger.warn).to.have.been.calledWithExactly({
            event: 'module_component_type_unknown',
            message: 'Component inconnu: unknown',
          });
        });
      });

      describe('when an element has an unknown type', function () {
        it('should log the error', async function () {
          // given
          const moduleData = {
            id: '6282925d-4775-4bca-b513-4c3009ec5886',
            slug: 'title',
            title: 'title',
            isBeta: true,
            details: {
              image: 'https://images.pix.fr/modulix/placeholder-details.svg',
              description: 'Description',
              duration: 5,
              level: 'novice',
              tabletSupport: 'comfortable',
              objectives: ['Objective 1'],
            },
            sections: [
              {
                id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
                type: 'practise',
                grains: [
                  {
                    id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                    type: 'lesson',
                    title: 'title',
                    components: [
                      {
                        type: 'element',
                        element: {
                          id: '8d7687c8-4a02-4d7e-bf6c-693a6d481c78',
                          type: 'unknown',
                          content: '<p>content</p>',
                          alt: 'Alternative',
                          alternativeText: 'Alternative textuelle',
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          };
          sinon.stub(logger, 'warn').returns();

          // when
          await ModuleFactory.build(moduleData);

          // then
          expect(logger.warn).to.have.been.calledWithExactly({
            event: 'module_element_type_unknown',
            message: 'Element inconnu: unknown',
          });
        });
      });

      describe('when a qrocm has an unknown proposal type', function () {
        it('should log the error', async function () {
          // given
          const moduleData = {
            id: '6282925d-4775-4bca-b513-4c3009ec5886',
            slug: 'title',
            title: 'title',
            isBeta: true,
            details: {
              image: 'https://images.pix.fr/modulix/placeholder-details.svg',
              description: 'Description',
              duration: 5,
              level: 'novice',
              tabletSupport: 'comfortable',
              objectives: ['Objective 1'],
            },
            sections: [
              {
                id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
                type: 'practise',
                grains: [
                  {
                    id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                    type: 'lesson',
                    title: 'title',
                    components: [
                      {
                        type: 'element',
                        element: {
                          id: 'c23436d4-6261-49f1-b50d-13a547529c29',
                          type: 'qrocm',
                          instruction: '<p>Compléter le texte suivant :</p>',
                          proposals: [
                            {
                              type: 'unknown',
                              content: '<span>Pix est un</span>',
                            },
                          ],
                          feedbacks: {
                            valid:
                              '<span class="feedback__state">Correct&#8239;!</span><p> vous nous connaissez bien&nbsp;<span aria-hidden="true">🎉</span></p>',
                            invalid:
                              '<span class="feedback__state">Incorrect&#8239;!</span><p> vous y arriverez la prochaine fois&#8239;!</p>',
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          };
          sinon.stub(logger, 'warn').returns();

          // when
          await ModuleFactory.build(moduleData);

          // then
          expect(logger.warn).to.have.been.calledWithExactly('Type de proposal inconnu: unknown');
        });
      });
    });

    it('should instantiate a Module with a grain containing components', async function () {
      // given
      const version = Symbol('version');
      const moduleData = {
        id: '6282925d-4775-4bca-b513-4c3009ec5886',
        slug: 'title',
        title: 'title',
        version,
        isBeta: true,
        details: {
          image: 'https://assets.pix.org/modulix/placeholder-details.svg',
          description: 'Description',
          duration: 5,
          level: 'novice',
          tabletSupport: 'comfortable',
          objectives: ['Objective 1'],
        },
        sections: [
          {
            id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
            type: 'practise',
            grains: [
              {
                id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                type: 'lesson',
                title: 'title',
                components: [
                  {
                    type: 'element',
                    element: {
                      id: '8d7687c8-4a02-4d7e-bf6c-693a6d481c78',
                      type: 'image',
                      url: 'https://assets.pix.org/modulix/didacticiel/ordi-spatial.svg',
                      alt: 'Alternative',
                      alternativeText: 'Alternative textuelle',
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      // when
      const module = await ModuleFactory.build(moduleData);

      // then
      expect(module).to.be.an.instanceOf(Module);
      expect(module.version).to.equal(version);
      expect(module.sections[0].grains).not.to.be.empty;
      for (const grain of module.sections[0].grains) {
        expect(grain).to.be.instanceof(Grain);
        expect(grain.components).not.to.be.empty;
      }
    });

    describe('With ComponentElement', function () {
      it('should instantiate a Module with a ComponentElement which contains a Custom Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://assets.pix.org/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'discovery',
                  title: 'title',
                  components: [
                    {
                      type: 'element',
                      element: {
                        id: 'cfec5a0e-2ed5-462f-8974-e5ca25faae39',
                        type: 'custom',
                        tagName: 'message-conversation',
                        props: {
                          title: 'Confessions nocturnes',
                          messages: [
                            {
                              userName: 'Mel',
                              direction: 'outgoing',
                              content: "Ouais c'est qui là ?",
                            },
                            {
                              userName: 'Vita',
                              direction: 'incoming',
                              content: "Mel, c'est Vi ouvre moi.",
                            },
                            {
                              userName: 'Mel',
                              direction: 'outgoing',
                              content: 'Ça va Vi ?',
                            },
                            {
                              userName: 'Mel',
                              direction: 'outgoing',
                              content: "T'as l'air bizarre. Qu'est ce qu'il y a ?",
                            },
                            {
                              userName: 'Vita',
                              direction: 'incoming',
                              content: 'Non, ça va pas non.',
                            },
                            {
                              userName: 'Mel',
                              direction: 'outgoing',
                              content: "Ben dis-moi, qu'est qu'il y a ?",
                            },
                            {
                              userName: 'Vita',
                              direction: 'incoming',
                              content: 'Mel, assieds-toi faut que je te parle...',
                            },
                            {
                              userName: 'Vita',
                              direction: 'incoming',
                              content: "J'ai passé ma journée dans le noir.",
                            },
                            {
                              userName: 'Vita',
                              direction: 'incoming',
                              content: 'Mel, je le sens, je le sais, je le suis, il se fout de moi...',
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0].element).to.be.an.instanceOf(CustomElement);
      });

      it('should instantiate a Module with a ComponentElement which contains a CustomDraft Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://assets.pix.org/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'discovery',
                  title: 'title',
                  components: [
                    {
                      type: 'element',
                      element: {
                        id: 'f00133f5-0653-425b-a25f-3c9604820529',
                        type: 'custom-draft',
                        title: 'Retourner les cartes',
                        url: 'https://1024pix.github.io/atelier-contenus/RPE/cartes2.html',
                        instruction: '<p>Retournez les cartes.</p>',
                        height: 400,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0].element).to.be.an.instanceOf(CustomDraft);
      });

      it('should instantiate a Module with a ComponentElement which contains an Image Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://assets.pix.org/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'element',
                      element: {
                        id: '8d7687c8-4a02-4d7e-bf6c-693a6d481c78',
                        type: 'image',
                        url: 'https://assets.pix.org/modulix/didacticiel/ordi-spatial.svg',
                        alt: 'Alternative',
                        alternativeText: 'Alternative textuelle',
                        legend: 'legend',
                        licence: 'licence',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0].element).to.be.an.instanceOf(Image);
      });

      it('should instantiate a Module with a ComponentElement which contains a Separator Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://images.pix.fr/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'element',
                      element: {
                        id: '11f382f1-d36a-48d2-a99d-4aa052ab7841',
                        type: 'separator',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0].element).to.be.an.instanceOf(Separator);
        expect(module.sections[0].grains[0].components[0].element).to.deep.equal({
          id: '11f382f1-d36a-48d2-a99d-4aa052ab7841',
          isAnswerable: false,
          type: 'separator',
        });
      });

      it('should instantiate a Module with a ComponentElement which contains a Text Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://images.pix.fr/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'element',
                      element: {
                        id: '84726001-1665-457d-8f13-4a74dc4768ea',
                        type: 'text',
                        content: '<h4>Content</h4>',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0].element).to.be.an.instanceOf(Text);
      });

      it('should instantiate a Module with a ComponentElement which contains a Video Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://assets.pix.org/modules/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'element',
                      element: {
                        id: '3a9f2269-99ba-4631-b6fd-6802c88d5c26',
                        type: 'video',
                        title: 'Le format des adresses mail',
                        url: 'https://assets.pix.org/modules/chat_animation_2.webm',
                        subtitles: 'https://assets.pix.org/modules/chat_animation_2.vtt',
                        transcription: 'Insert transcription here',
                        poster: 'https://example.org/modulix/video-poster.jpg',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0].element).to.be.an.instanceOf(Video);
        expect(module.sections[0].grains[0].components[0].element).to.deep.equal({
          id: '3a9f2269-99ba-4631-b6fd-6802c88d5c26',
          type: 'video',
          title: 'Le format des adresses mail',
          url: 'https://assets.pix.org/modules/chat_animation_2.webm',
          subtitles: 'https://assets.pix.org/modules/chat_animation_2.vtt',
          transcription: 'Insert transcription here',
          isAnswerable: false,
          poster: 'https://example.org/modulix/video-poster.jpg',
        });
      });

      it('should instantiate a Module with a ComponentElement which contains a Download Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://images.pix.fr/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'element',
                      element: {
                        id: '3a9f2269-99ba-4631-b6fd-6802c88d5c26',
                        type: 'download',
                        files: [
                          {
                            url: 'https://example.org/modulix/file.pdf',
                            format: '.pdf',
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0].element).to.be.an.instanceOf(Download);
      });

      it('should instantiate a Module with a ComponentElement which contains an Embed Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://images.pix.fr/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'element',
                      element: {
                        id: '3a9f2269-99ba-4631-b6fd-6802c88d5c26',
                        type: 'embed',
                        isCompletionRequired: false,
                        title: "Simulateur d'adresse mail",
                        url: 'https://embed.fr',
                        height: 150,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0].element).to.be.an.instanceOf(Embed);
      });

      it('should instantiate a Module with a ComponentElement which contains a QCU Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://images.pix.fr/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'element',
                      element: {
                        id: 'ba78dead-a806-4954-b408-e8ef28d28fab',
                        type: 'qcu',
                        instruction: '<p>L’adresse mail M3g4Cool1415@gmail.com est correctement écrite ?</p>',
                        proposals: [
                          {
                            id: '1',
                            content: 'Vrai',
                            feedback: { state: 'Bonne réponse !' },
                          },
                          {
                            id: '2',
                            content: 'Faux',
                            feedback: { state: "Faux n'est pas la bonne réponse." },
                          },
                        ],

                        solution: '1',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0].element).to.be.an.instanceOf(QCU);
      });

      it('should instantiate a Module with a ComponentElement which contains a QCUDeclarative Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://images.pix.fr/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'element',
                      element: {
                        id: '6a6944be-a8a3-4138-b5dc-af664cf40b07',
                        type: 'qcu-declarative',
                        instruction: '<p>Quand faut-il mouiller sa brosse à dents ?</p>',
                        proposals: [
                          {
                            id: '1',
                            content: 'Avant de mettre le dentifrice',
                            feedback: {
                              diagnosis: "<p>C'est l'approche de la plupart des gens.</p>",
                            },
                          },
                          {
                            id: '2',
                            content: 'Après avoir mis le dentifrice',
                            feedback: {
                              diagnosis: '<p>Possible, mais attention à ne pas faire tomber le dentifrice !</p>',
                            },
                          },
                          {
                            id: '3',
                            content: 'Pendant que le dentifrice est mis',
                            feedback: {
                              diagnosis: '<p>Digne des plus grands acrobates !</p>',
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0].element).to.be.an.instanceOf(QCUDeclarative);
      });

      it('should instantiate a Module with a ComponentElement which contains a QCUDiscovery Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://assets.pix.org/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'discovery',
                  title: 'title',
                  components: [
                    {
                      type: 'element',
                      element: {
                        id: '6a6944be-a8a3-4138-b5dc-af664cf40b07',
                        type: 'qcu-discovery',
                        instruction: '<p>Quel est le dessert classique idéal lors d’un goûter&nbsp;?</p>',
                        proposals: [
                          {
                            id: '1',
                            content: 'Des cookies maison tout chauds',
                            feedback: {
                              diagnosis:
                                '<p>Il n’y a rien de plus réconfortant que des cookies tout juste sortis du four !</p>',
                            },
                          },
                          {
                            id: '2',
                            content: 'Des mini-éclairs au chocolat',
                            feedback: {
                              diagnosis:
                                '<p>Les éclairs, c’est un peu l’élégance à l’état pur. Légers, crémeux, et surtout irrésistibles.</p>',
                            },
                          },
                          {
                            id: '3',
                            content: 'Un plateau de fruits frais et de fromage',
                            feedback: {
                              diagnosis:
                                '<p>Parfait pour ceux qui préfèrent un goûter plus léger, mais tout aussi délicieux.</p>',
                            },
                          },
                          {
                            id: '4',
                            content: 'Une part de gâteau marbré au chocolat et à la vanille',
                            feedback: {
                              diagnosis:
                                '<p>Un gâteau moelleux et gourmand qui se marie parfaitement avec une tasse de thé ou de café.</p>',
                            },
                          },
                        ],
                        solution: '1',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0].element).to.be.an.instanceOf(QCUDiscovery);
      });

      it('should instantiate a Module with a ComponentElement which contains a QCM Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://images.pix.fr/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'element',
                      element: {
                        id: '30701e93-1b4d-4da4-b018-fa756c07d53f',
                        type: 'qcm',
                        instruction: '<p>Quels sont les 3 piliers de Pix ?</p>',
                        proposals: [
                          {
                            id: '1',
                            content: 'Evaluer ses connaissances et savoir-faire sur 16 compétences du numérique',
                          },
                          {
                            id: '2',
                            content: 'Développer son savoir-faire sur les jeux de type TPS',
                          },
                          {
                            id: '3',
                            content: 'Développer ses compétences numériques',
                          },
                          {
                            id: '4',
                            content: 'Certifier ses compétences Pix',
                          },
                          {
                            id: '5',
                            content: 'Evaluer ses compétences de logique et compréhension mathématique',
                          },
                        ],
                        feedbacks: {
                          valid: '<p>Correct ! Vous nous avez bien cernés :)</p>',
                          invalid:
                            '<p>Et non ! Pix sert à évaluer, certifier et développer ses compétences numériques.',
                        },
                        solutions: ['1', '3', '4'],
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0].element).to.be.an.instanceOf(QCM);
      });

      it('should instantiate a Module with a ComponentElement which contains a QROCM Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://images.pix.fr/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'element',
                      element: {
                        id: '98c51fa7-03b7-49b1-8c5e-49341d35909c',
                        type: 'qrocm',
                        instruction:
                          "<p>Pour être sûr que tout est clair, complétez le texte ci-dessous <span aria-hidden='true'>🧩</span></p><p>Si vous avez besoin d’aide, revenez en arrière <span aria-hidden='true'>⬆️</span></p>",
                        proposals: [
                          {
                            type: 'text',
                            content: '<p>Le symbole</>',
                          },
                          {
                            input: 'symbole',
                            type: 'input',
                            inputType: 'text',
                            size: 1,
                            display: 'inline',
                            placeholder: '',
                            ariaLabel: 'Réponse 1',
                            defaultValue: '',
                            tolerances: ['t1'],
                            solutions: ['@'],
                          },
                          {
                            input: 'premiere-partie',
                            type: 'select',
                            display: 'inline',
                            placeholder: '',
                            ariaLabel: 'Réponse 2',
                            defaultValue: '',
                            tolerances: [],
                            options: [
                              {
                                id: '1',
                                content: "l'identifiant",
                              },
                              {
                                id: '2',
                                content: "le fournisseur d'adresse mail",
                              },
                            ],
                            solutions: ['1'],
                          },
                        ],
                        feedbacks: {
                          valid: '<p>Bravo ! 🎉 </p>',
                          invalid: "<p class='pix-list-inline'>Et non !</p>",
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0].element).to.be.an.instanceOf(QROCM);
      });

      it('should instantiate a Module with a ComponentElement which contains a Flashcard Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://images.pix.fr/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'element',
                      element: {
                        id: '71de6394-ff88-4de3-8834-a40057a50ff4',
                        type: 'flashcards',
                        title: "Introduction à l'adresse e-mail",
                        instruction: '<p>...</p>',
                        introImage: {
                          url: 'https://example.org/image.jpeg',
                        },
                        cards: [
                          {
                            id: 'e1de6394-ff88-4de3-8834-a40057a50ff4',
                            recto: {
                              image: {
                                url: 'https://example.org/image.jpeg',
                              },
                              text: "A quoi sert l'arobase dans mon adresse email ?",
                            },
                            verso: {
                              image: {
                                url: 'https://example.org/image.jpeg',
                              },
                              text: "Parce que c'est joli",
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        const flashcards = module.sections[0].grains[0].components[0].element;
        const expectedFlashcards = moduleData.sections[0].grains[0].components[0].element;
        validateFlashcards(flashcards, expectedFlashcards);
      });

      it('should instantiate a Module with a ComponentElement which contains a Expand Element', async function () {
        // given
        const givenData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://images.pix.fr/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'element',
                      element: {
                        id: '71de6394-ff88-4de3-8834-a40057a50ff4',
                        type: 'expand',
                        title: "Plus d'info sur la poésie",
                        content: '<p>La poésie c’est cool</p>',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(givenData);

        // then
        const expand = module.sections[0].grains[0].components[0].element;
        const expectedExpand = givenData.sections[0].grains[0].components[0].element;
        expect(expand.id).to.equal(expectedExpand.id);
        expect(expand.content).to.equal(expectedExpand.content);
        expect(expand.title).to.equal(expectedExpand.title);
        expect(expand.type).to.equal(expectedExpand.type);
      });

      it('should instantiate a Module with a ComponentElement which contains a QAB Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://images.pix.fr/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'cf436761-f56d-4b01-83f9-942afe9ce72c',
                  type: 'lesson',
                  title: 'test qab',
                  components: [
                    {
                      type: 'element',
                      element: {
                        id: 'ed795d29-5f04-499c-a9c8-4019125c5cb1',
                        type: 'qab',
                        instruction:
                          '<p><strong>Maintenant, entraînez-vous sur des exemples concrets !</strong> </p> <p> Pour chaque exemple, choisissez si l’affirmation est <strong>vraie</strong> ou <strong>fausse</strong>.</p>',
                        cards: [
                          {
                            id: '4420c9f6-ae21-4401-a16c-41296d898a66',
                            text: 'La Terre est plus proche du Soleil que Mars.',
                            proposalA: 'Vrai',
                            proposalB: 'Faux',
                            solution: 'B',
                          },
                          {
                            id: '52d99648-5904-4a66-9fb8-476ba4da9465',
                            text: 'L’eau bout à 100°C au niveau de la mer.',
                            proposalA: 'Vrai',
                            proposalB: 'Faux',
                            solution: 'A',
                          },
                        ],
                        feedback: {
                          diagnosis: '<p>Continuez comme ça !</p>',
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0].element).to.be.instanceOf(QAB);
      });
    });

    describe('With ComponentStepper', function () {
      it('should instantiate a Module with a ComponentStepper which contains an Image Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://assets.pix.org/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'stepper',
                      steps: [
                        {
                          elements: [
                            {
                              id: '8d7687c8-4a02-4d7e-bf6c-693a6d481c78',
                              type: 'image',
                              url: 'https://assets.pix.org/modulix/didacticiel/ordi-spatial.svg',
                              alt: "Dessin détaillé dans l'alternative textuelle",
                              alternativeText: "Dessin d'un ordinateur dans un univers spatial.",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0]).to.be.an.instanceOf(ComponentStepper);
        expect(module.sections[0].grains[0].components[0].steps[0]).to.be.an.instanceOf(Step);
        expect(module.sections[0].grains[0].components[0].steps[0].elements[0]).to.be.an.instanceOf(Image);
      });

      it('should instantiate a Module with a ComponentStepper which contains a Separator Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://images.pix.fr/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'stepper',
                      steps: [
                        {
                          elements: [
                            {
                              id: '11f382f1-d36a-48d2-a99d-4aa052ab7841',
                              type: 'separator',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0]).to.be.an.instanceOf(ComponentStepper);
        expect(module.sections[0].grains[0].components[0].steps[0]).to.be.an.instanceOf(Step);
        expect(module.sections[0].grains[0].components[0].steps[0].elements[0]).to.be.an.instanceOf(Separator);
      });

      it('should instantiate a Module with a ComponentStepper which contains a Text Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://images.pix.fr/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'stepper',
                      steps: [
                        {
                          elements: [
                            {
                              id: '342183f7-af51-4e4e-ab4c-ebed1e195063',
                              type: 'text',
                              content:
                                '<p>À la fin de cette vidéo, une question sera posée sur les compétences Pix.</p>',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0]).to.be.an.instanceOf(ComponentStepper);
        expect(module.sections[0].grains[0].components[0].steps[0]).to.be.an.instanceOf(Step);
        expect(module.sections[0].grains[0].components[0].steps[0].elements[0]).to.be.an.instanceOf(Text);
      });

      it('should instantiate a Module with a ComponentStepper which contains a Video Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://assets.pix.org/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'stepper',
                      steps: [
                        {
                          elements: [
                            {
                              id: '3a9f2269-99ba-4631-b6fd-6802c88d5c26',
                              type: 'video',
                              title: 'Vidéo de présentation de Pix',
                              url: 'https://assets.pix.org/modulix/didacticiel/presentation.mp4',
                              subtitles: '',
                              transcription:
                                '<p>Le numérique évolue en permanence, vos compétences aussi, pour travailler, communiquer et s\'informer, se déplacer, réaliser des démarches, un enjeu tout au long de la vie.</p><p>Sur <a href="https://pix.fr" target="blank">pix.fr</a>, testez-vous et cultivez vos compétences numériques.</p><p>Les tests Pix sont personnalisés, les questions s\'adaptent à votre niveau, réponse après réponse.</p><p>Évaluez vos connaissances et savoir-faire sur 16 compétences, dans 5 domaines, sur 5 niveaux de débutants à confirmer, avec des mises en situation ludiques, recherches en ligne, manipulation de fichiers et de données, culture numérique...</p><p>Allez à votre rythme, vous pouvez arrêter et reprendre quand vous le voulez.</p><p>Toutes les 5 questions, découvrez vos résultats et progressez grâce aux astuces et aux tutos.</p><p>En relevant les défis Pix, vous apprendrez de nouvelles choses et aurez envie d\'aller plus loin.</p><p>Vous pensez pouvoir faire mieux&#8239;?</p><p>Retentez les tests et améliorez votre score.</p><p>Faites reconnaître officiellement votre niveau en passant la certification Pix, reconnue par l\'État et le monde professionnel.</p><p>Pix&nbsp;: le service public en ligne pour évaluer, développer et certifier ses compétences numériques.</p>',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0]).to.be.an.instanceOf(ComponentStepper);
        expect(module.sections[0].grains[0].components[0].steps[0]).to.be.an.instanceOf(Step);
        expect(module.sections[0].grains[0].components[0].steps[0].elements[0]).to.be.an.instanceOf(Video);
      });

      it('should instantiate a Module with a ComponentStepper which contains a Download Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://images.pix.fr/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'stepper',
                      steps: [
                        {
                          elements: [
                            {
                              id: '3a9f2269-99ba-4631-b6fd-6802c88d5c26',
                              type: 'download',
                              files: [
                                {
                                  url: 'https://example.org/modulix/file.pdf',
                                  format: '.pdf',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0]).to.be.an.instanceOf(ComponentStepper);
        expect(module.sections[0].grains[0].components[0].steps[0]).to.be.an.instanceOf(Step);
        expect(module.sections[0].grains[0].components[0].steps[0].elements[0]).to.be.an.instanceOf(Download);
      });

      it('should instantiate a Module with a ComponentStepper which contains an Embed Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://images.pix.fr/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'stepper',
                      steps: [
                        {
                          elements: [
                            {
                              id: '3a9f2269-99ba-4631-b6fd-6802c88d5c26',
                              type: 'embed',
                              isCompletionRequired: false,
                              title: "Simulateur d'adresse mail",
                              url: 'https://embed.fr',
                              instruction: '<p>Parcourez ces photos trouvées sur le Web.</p>',
                              height: 150,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0]).to.be.an.instanceOf(ComponentStepper);
        expect(module.sections[0].grains[0].components[0].steps[0]).to.be.an.instanceOf(Step);
        expect(module.sections[0].grains[0].components[0].steps[0].elements[0]).to.be.an.instanceOf(Embed);
      });

      it('should instantiate a Module with a ComponentStepper which contains a QCU Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://images.pix.fr/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'stepper',
                      steps: [
                        {
                          elements: [
                            {
                              id: '71de6394-ff88-4de3-8834-a40057a50ff4',
                              type: 'qcu',
                              instruction: '<p>Pix évalue 16 compétences numériques différentes.</p>',
                              proposals: [
                                {
                                  id: '1',
                                  content: 'Vrai',
                                  feedback: { state: 'Bonne réponse !' },
                                },
                                {
                                  id: '2',
                                  content: 'Faux',
                                  feedback: {
                                    state: "Faux n'est pas la bonne réponse.",
                                  },
                                },
                              ],
                              solution: '1',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0]).to.be.an.instanceOf(ComponentStepper);
        expect(module.sections[0].grains[0].components[0].steps[0]).to.be.an.instanceOf(Step);
        expect(module.sections[0].grains[0].components[0].steps[0].elements[0]).to.be.an.instanceOf(QCU);
      });

      it('should instantiate a Module with a ComponentStepper which contains a QCUDeclarative Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://images.pix.fr/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'stepper',
                      steps: [
                        {
                          elements: [
                            {
                              id: '6a6944be-a8a3-4138-b5dc-af664cf40b07',
                              type: 'qcu-declarative',
                              instruction: '<p>Quand faut-il mouiller sa brosse à dents ?</p>',
                              proposals: [
                                {
                                  id: '1',
                                  content: 'Avant de mettre le dentifrice',
                                  feedback: {
                                    diagnosis: "<p>C'est l'approche de la plupart des gens.</p>",
                                  },
                                },
                                {
                                  id: '2',
                                  content: 'Après avoir mis le dentifrice',
                                  feedback: {
                                    diagnosis: '<p>Possible, mais attention à ne pas faire tomber le dentifrice !</p>',
                                  },
                                },
                                {
                                  id: '3',
                                  content: 'Pendant que le dentifrice est mis',
                                  feedback: {
                                    diagnosis: '<p>Digne des plus grands acrobates !</p>',
                                  },
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0]).to.be.an.instanceOf(ComponentStepper);
        expect(module.sections[0].grains[0].components[0].steps[0]).to.be.an.instanceOf(Step);
        expect(module.sections[0].grains[0].components[0].steps[0].elements[0]).to.be.an.instanceOf(QCUDeclarative);
      });

      it('should instantiate a Module with a ComponentStepper which contains a QCM Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://images.pix.fr/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'stepper',
                      steps: [
                        {
                          elements: [
                            {
                              id: '30701e93-1b4d-4da4-b018-fa756c07d53f',
                              type: 'qcm',
                              instruction: '<p>Quels sont les 3 piliers de Pix&#8239;?</p>',
                              proposals: [
                                {
                                  id: '1',
                                  content: 'Evaluer ses connaissances et savoir-faire sur 16 compétences du numérique',
                                },
                                {
                                  id: '2',
                                  content: 'Développer son savoir-faire sur les jeux de type TPS',
                                },
                                {
                                  id: '3',
                                  content: 'Développer ses compétences numériques',
                                },
                                {
                                  id: '4',
                                  content: 'Certifier ses compétences Pix',
                                },
                                {
                                  id: '5',
                                  content: 'Evaluer ses compétences de logique et compréhension mathématique',
                                },
                              ],
                              feedbacks: {
                                valid: '<p>Correct&#8239;! Vous nous avez bien cernés&nbsp;:)</p>',
                                invalid:
                                  '<p>Et non&#8239;! Pix sert à évaluer, certifier et développer ses compétences numériques.</p>',
                              },
                              solutions: ['1', '3', '4'],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0]).to.be.an.instanceOf(ComponentStepper);
        expect(module.sections[0].grains[0].components[0].steps[0]).to.be.an.instanceOf(Step);
        expect(module.sections[0].grains[0].components[0].steps[0].elements[0]).to.be.an.instanceOf(QCM);
      });

      it('should instantiate a Module with a ComponentStepper which contains a QROCM Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://images.pix.fr/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'stepper',
                      steps: [
                        {
                          elements: [
                            {
                              id: 'c23436d4-6261-49f1-b50d-13a547529c29',
                              type: 'qrocm',
                              instruction: '<p>Compléter le texte suivant :</p>',
                              proposals: [
                                {
                                  type: 'text',
                                  content: '<span>Pix est un</span>',
                                },
                                {
                                  input: 'pix-name',
                                  type: 'input',
                                  inputType: 'text',
                                  size: 10,
                                  display: 'inline',
                                  placeholder: '',
                                  ariaLabel: 'Mot à trouver',
                                  defaultValue: '',
                                  tolerances: ['t1', 't3'],
                                  solutions: ['Groupement'],
                                },
                                {
                                  type: 'text',
                                  content: "<span>d'intérêt public qui a été créée en</span>",
                                },
                                {
                                  input: 'pix-birth',
                                  type: 'input',
                                  inputType: 'text',
                                  size: 10,
                                  display: 'inline',
                                  placeholder: '',
                                  ariaLabel: 'Année à trouver',
                                  defaultValue: '',
                                  tolerances: [],
                                  solutions: ['2016'],
                                },
                              ],
                              feedbacks: {
                                valid:
                                  '<p>Correct&#8239;! vous nous connaissez bien&nbsp;<span aria-hidden="true">🎉</span></p>',
                                invalid: '<p>Incorrect&#8239;! vous y arriverez la prochaine fois&#8239;!</p>',
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0]).to.be.an.instanceOf(ComponentStepper);
        expect(module.sections[0].grains[0].components[0].steps[0]).to.be.an.instanceOf(Step);
        expect(module.sections[0].grains[0].components[0].steps[0].elements[0]).to.be.an.instanceOf(QROCM);
      });

      it('should instantiate a Module with a ComponentElement which contains a Flashcard Element', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://images.pix.fr/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'stepper',
                      steps: [
                        {
                          elements: [
                            {
                              id: '71de6394-ff88-4de3-8834-a40057a50ff4',
                              type: 'flashcards',
                              title: "Introduction à l'adresse e-mail",
                              instruction: '<p>...</p>',
                              introImage: {
                                url: 'https://example.org/image.jpeg',
                              },
                              cards: [
                                {
                                  id: 'e1de6394-ff88-4de3-8834-a40057a50ff4',
                                  recto: {
                                    image: {
                                      url: 'https://example.org/image.jpeg',
                                    },
                                    text: "A quoi sert l'arobase dans mon adresse email ?",
                                  },
                                  verso: {
                                    image: {
                                      url: 'https://example.org/image.jpeg',
                                    },
                                    text: "Parce que c'est joli",
                                  },
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        const flashcards = module.sections[0].grains[0].components[0].steps[0].elements[0];
        const expectedFlashcards = moduleData.sections[0].grains[0].components[0].steps[0].elements[0];
        validateFlashcards(flashcards, expectedFlashcards);
      });

      it('should filter out unknown element type', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://images.pix.fr/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'stepper',
                      steps: [
                        {
                          elements: [
                            {
                              id: '342183f7-af51-4e4e-ab4c-ebed1e195063',
                              type: 'text',
                              content:
                                '<p>À la fin de cette vidéo, une question sera posée sur les compétences Pix.</p>',
                            },
                            {
                              id: '16ad694a-848f-456d-95a6-c488350c3ed7',
                              type: 'unknown',
                              content: 'Should not be added to the grain',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const module = await ModuleFactory.build(moduleData);

        // then
        expect(module.sections[0].grains[0].components[0]).to.be.an.instanceOf(ComponentStepper);
        expect(module.sections[0].grains[0].components[0].steps[0]).to.be.an.instanceOf(Step);
        expect(module.sections[0].grains[0].components[0].steps[0].elements).to.have.lengthOf(1);
        expect(module.sections[0].grains[0].components[0].steps[0].elements[0]).to.be.an.instanceOf(Text);
      });

      it('should filter out steps with only unknown element type', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://images.pix.fr/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'stepper',
                      steps: [
                        {
                          elements: [
                            {
                              id: '342183f7-af51-4e4e-ab4c-ebed1e195063',
                              type: 'text',
                              content:
                                '<p>À la fin de cette vidéo, une question sera posée sur les compétences Pix.</p>',
                            },
                          ],
                        },
                        {
                          elements: [
                            {
                              id: '16ad694a-848f-456d-95a6-c488350c3ed7',
                              type: 'unknown',
                              content: 'Should not be added to the grain',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const error = await catchErr(ModuleFactory.build)(moduleData);

        // then
        expect(error).to.be.an.instanceOf(ModuleInstantiationError);
        expect(error.message).to.deep.equal('A step should contain at least one element');
      });

      it('should filter out stepper with only unknown element type', async function () {
        // given
        const moduleData = {
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          slug: 'title',
          title: 'title',
          isBeta: true,
          details: {
            image: 'https://images.pix.fr/modulix/placeholder-details.svg',
            description: 'Description',
            duration: 5,
            level: 'novice',
            tabletSupport: 'comfortable',
            objectives: ['Objective 1'],
          },
          sections: [
            {
              id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
              type: 'practise',
              grains: [
                {
                  id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                  type: 'lesson',
                  title: 'title',
                  components: [
                    {
                      type: 'stepper',
                      steps: [
                        {
                          elements: [
                            {
                              id: '16ad694a-848f-456d-95a6-c488350c3ed7',
                              type: 'unknown',
                              content: 'Should not be added to the grain',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        };

        // when
        const error = await catchErr(ModuleFactory.build)(moduleData);

        // then
        expect(error).to.be.an.instanceOf(ModuleInstantiationError);
        expect(error.message).to.deep.equal('A step should contain at least one element');
      });
    });

    it('should filter out unknown component types', async function () {
      // given
      const moduleData = {
        id: '6282925d-4775-4bca-b513-4c3009ec5886',
        slug: 'title',
        title: 'title',
        isBeta: true,
        details: {
          image: 'https://images.pix.fr/modulix/placeholder-details.svg',
          description: 'Description',
          duration: 5,
          level: 'novice',
          tabletSupport: 'comfortable',
          objectives: ['Objective 1'],
        },
        sections: [
          {
            id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
            type: 'practise',
            grains: [
              {
                id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                type: 'lesson',
                title: 'title',
                components: [
                  {
                    type: 'element',
                    element: {
                      id: '84726001-1665-457d-8f13-4a74dc4768ea',
                      type: 'text',
                      content: '<h4>Content</h4>',
                    },
                  },
                  {
                    type: 'unknown',
                    unknown: {
                      id: '16ad694a-848f-456d-95a6-c488350c3ed7',
                      type: 'text',
                      content: '<h4>Content</h4>',
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      // when
      const module = await ModuleFactory.build(moduleData);

      // then
      expect(module).to.be.an.instanceOf(Module);
      expect(module.sections[0].grains).not.to.be.empty;
      expect(module.sections[0].grains[0].components).to.have.lengthOf(1);
      expect(module.sections[0].grains[0].components[0].element).not.to.be.empty;
    });

    it('should filter out component if element type is unknown', async function () {
      // given
      const moduleData = {
        id: '6282925d-4775-4bca-b513-4c3009ec5886',
        slug: 'title',
        title: 'title',
        isBeta: true,
        details: {
          image: 'https://images.pix.fr/modulix/placeholder-details.svg',
          description: 'Description',
          duration: 5,
          level: 'novice',
          tabletSupport: 'comfortable',
          objectives: ['Objective 1'],
        },
        sections: [
          {
            id: '5bf1c672-3746-4480-b9ac-1f0af9c7c509',
            type: 'practise',
            grains: [
              {
                id: 'f312c33d-e7c9-4a69-9ba0-913957b8f7dd',
                type: 'lesson',
                title: 'title',
                components: [
                  {
                    type: 'element',
                    element: {
                      id: '84726001-1665-457d-8f13-4a74dc4768ea',
                      type: 'text',
                      content: '<h4>Content</h4>',
                    },
                  },
                  {
                    type: 'element',
                    element: {
                      id: '16ad694a-848f-456d-95a6-c488350c3ed7',
                      type: 'unknown',
                      content: 'Should not be added to the grain',
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      // when
      const module = await ModuleFactory.build(moduleData);

      // then
      expect(module).to.be.an.instanceOf(Module);
      expect(module.sections[0].grains).not.to.be.empty;
      expect(module.sections[0].grains[0].components).to.have.lengthOf(1);
      expect(module.sections[0].grains[0].components[0].element).not.to.be.empty;
    });
  });
});
