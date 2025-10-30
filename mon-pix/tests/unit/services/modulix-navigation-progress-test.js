import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Services | Module | ModulixNavigationProgress', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {});

  module('#setCurrentSectionIndex', function () {
    test('should set currentSectionIndex to given one', function (assert) {
      // given
      const ModulixNavigationProgress = this.owner.lookup('service:modulix-navigation-progress');
      const nextIndex = 1;

      // when
      ModulixNavigationProgress.setCurrentSectionIndex(nextIndex);

      // then
      assert.strictEqual(ModulixNavigationProgress.currentSectionIndex, 1);
    });

    test('should set currentSectionIndex to 0 if provided one is negative', function (assert) {
      // given
      const ModulixNavigationProgress = this.owner.lookup('service:modulix-navigation-progress');
      const nextIndex = -1;

      // when
      ModulixNavigationProgress.setCurrentSectionIndex(nextIndex);

      // then
      assert.strictEqual(ModulixNavigationProgress.currentSectionIndex, 0);
    });
  });

  module('#determineCurrentSection', function () {
    const enrichedSections = [
      {
        firstGrainId: '533c69b8-a836-41be-8ffc-8d4636e31224',
        lastGrainId: 'a39ce6eb-f3db-447f-808f-aa6a06b940c9',
        sectionId: 'cfaefec9-e185-43b8-8258-e8beff6dd56b',
        sectionIndex: 0,
        sectionType: 'question-yourself',
      },
      {
        firstGrainId: 'd6ed29e2-fb0b-4f03-9e26-61029ecde2e3',
        lastGrainId: '8bbfb1ef-3d35-48ce-bb3f-b63a8df9a8ac',
        sectionId: '1d2e3c80-0b23-40c6-bb56-4fa957207ac6',
        sectionIndex: 1,
        sectionType: 'blank',
      },
      {
        firstGrainId: 'b14df125-82d5-4d55-a660-7b34cd9ea1ab',
        lastGrainId: '358e6d74-4adf-463a-9bf4-69ddca521d87',
        sectionId: 'b0d428ab-a4ae-45e0-83fd-786fbd9c03dc',
        sectionIndex: 2,
        sectionType: 'practise',
      },
      {
        firstGrainId: '628bd37d-e5da-411f-9b06-1035b073411b',
        lastGrainId: '628bd37d-e5da-411f-9b06-1035b073411b',
        sectionId: '2cb5a4fa-a54f-4d94-9b1f-5f504821846a',
        sectionIndex: 3,
        sectionType: 'explore-to-understand',
      },
      {
        firstGrainId: 'df111992-ff3a-4c3f-ae5a-78bc359af23c',
        lastGrainId: '0d4ef09a-ebb8-4514-a037-8fb22e540d7c',
        sectionId: 'ea5ebe5d-f29f-4b03-8e9f-7c77606a014f',
        sectionIndex: 4,
        sectionType: 'retain-the-essentials',
      },
      {
        firstGrainId: '0be0f5eb-4cb6-47c2-b9d3-cb2ceb4cd21c',
        lastGrainId: '7cf75e70-8749-4392-8081-f2c02badb0fb',
        sectionId: '4a3c5230-3c60-4c1a-9395-7b65537dda25',
        sectionIndex: 5,
        sectionType: 'go-further',
      },
    ];
    module('When current grain is first grain in section ', function () {
      test('should not change currentSectionIndex', function (assert) {
        // given
        const ModulixNavigationProgress = this.owner.lookup('service:modulix-navigation-progress');
        const currentGrain = { id: enrichedSections[0].firstGrainId };
        const expectedCurrentSectionIndex = 0;
        // when
        ModulixNavigationProgress.determineCurrentSection(enrichedSections, currentGrain);

        // then
        assert.strictEqual(ModulixNavigationProgress.currentSectionIndex, expectedCurrentSectionIndex);
      });
    });
    module('When current grain is not first, neither last grain in section ', function () {
      test('should not change currentSectionIndex', function (assert) {
        // given
        const ModulixNavigationProgress = this.owner.lookup('service:modulix-navigation-progress');
        const currentGrain = { id: 'in between grain' };
        const expectedCurrentSectionIndex = 0;
        // when
        ModulixNavigationProgress.determineCurrentSection(enrichedSections, currentGrain);

        // then
        assert.strictEqual(ModulixNavigationProgress.currentSectionIndex, expectedCurrentSectionIndex);
      });
    });
    module('When current grain is last grain in section ', function () {
      test('should set currentSectionIndex to the next one', function (assert) {
        // given
        const ModulixNavigationProgress = this.owner.lookup('service:modulix-navigation-progress');
        const currentGrain = { id: enrichedSections[0].lastGrainId };
        const expectedCurrentSectionIndex = 1;
        // when
        ModulixNavigationProgress.determineCurrentSection(enrichedSections, currentGrain);

        // then
        assert.strictEqual(ModulixNavigationProgress.currentSectionIndex, expectedCurrentSectionIndex);
      });
    });
    module('When current grain is last grain in last section ', function () {
      test('should not change currentSectionIndex to the next one', function (assert) {
        // given
        const ModulixNavigationProgress = this.owner.lookup('service:modulix-navigation-progress');
        const currentSectionIndex = enrichedSections.length - 1;
        ModulixNavigationProgress.setCurrentSectionIndex(currentSectionIndex);
        const currentGrain = { id: enrichedSections[currentSectionIndex].lastGrainId };
        const expectedCurrentSectionIndex = currentSectionIndex;

        // when
        ModulixNavigationProgress.determineCurrentSection(enrichedSections, currentGrain);

        //then
        assert.strictEqual(ModulixNavigationProgress.currentSectionIndex, expectedCurrentSectionIndex);
      });
    });
  });
});
