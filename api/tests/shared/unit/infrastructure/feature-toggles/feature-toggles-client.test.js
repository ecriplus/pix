import Joi from 'joi';

import { FeatureTogglesClient } from '../../../../../src/shared/infrastructure/feature-toggles/feature-toggles-client.js';
import { InMemoryKeyValueStorage } from '../../../../../src/shared/infrastructure/key-value-storages/InMemoryKeyValueStorage.js';
import { expect } from '../../../../test-helper.js';

describe('Unit | Infrastructure | FeatureToggles | FeatureTogglesClient', function () {
  let config;
  let storage;

  beforeEach(async function () {
    storage = new InMemoryKeyValueStorage();
    config = {
      myToggle1: { description: 'Description 1', type: 'boolean', defaultValue: false, tags: ['tag1', 'tag2'] },
      myToggle2: { description: 'Description 2', type: 'boolean', defaultValue: true },
      myToggle3: { description: 'Description 3', type: 'string', defaultValue: 'foo', tags: ['tag3'] },
    };
  });

  describe('init', function () {
    it('initialize the storage with default values', async function () {
      // given
      const featureToggles = new FeatureTogglesClient(storage);

      // when
      await featureToggles.init(config);

      // then
      const all = await featureToggles.all();
      expect(all).to.deep.equal({ myToggle1: false, myToggle2: true, myToggle3: 'foo' });
    });

    it('adds and removes in feature toggles storage from a new configuration ', async function () {
      // given
      const featureToggles = new FeatureTogglesClient(storage);
      await featureToggles.init(config);

      // when
      const newConfig = {
        myToggle1: { description: 'Description 1', type: 'boolean', defaultValue: true },
        myToggle4: { description: 'Description 4', type: 'number', defaultValue: 1 },
      };
      await featureToggles.init(newConfig);

      // then
      const keys = await storage.keys('*');
      expect(keys).to.deep.equal(['myToggle1', 'myToggle4']);

      const all = await featureToggles.all();
      expect(all).to.deep.equal({ myToggle1: false, myToggle4: 1 });
    });

    it('throws an error when config is invalid', async function () {
      // given
      const invalidConfig = { myToggle1: { defaultValue: false } };
      const featureToggles = new FeatureTogglesClient(storage);

      // when / then
      await expect(featureToggles.init(invalidConfig)).to.rejectedWith(Joi.ValidationError);
    });
  });

  describe('get', function () {
    it('returns the value of a feature toggle', async function () {
      // given
      const featureToggles = new FeatureTogglesClient(storage);
      await featureToggles.init(config);

      // when
      const myToggle1 = await featureToggles.get('myToggle1');
      const myToggle2 = await featureToggles.get('myToggle2');

      // then
      expect(myToggle1).to.equal(false);
      expect(myToggle2).to.equal(true);
    });

    it('throws an error when feature toggle is not found', async function () {
      // given
      const featureToggles = new FeatureTogglesClient(storage);
      await featureToggles.init(config);

      // when / then
      await expect(featureToggles.get('unknownToggle')).to.rejectedWith(
        'Feature toggle with key "unknownToggle" not found in the configuration',
      );
    });
  });

  describe('set', function () {
    it('sets the value of a feature toggle', async function () {
      // given
      const featureToggles = new FeatureTogglesClient(storage);
      await featureToggles.init(config);

      // when
      await featureToggles.set('myToggle1', true);
      const myToggle1 = await featureToggles.get('myToggle1');

      // then
      expect(myToggle1).to.equal(true);
    });

    it('throws an error when feature toggle is not found', async function () {
      // given
      const featureToggles = new FeatureTogglesClient(storage);
      await featureToggles.init(config);

      // when / then
      await expect(featureToggles.set('unknownToggle', true)).to.rejectedWith(
        'Feature toggle with key "unknownToggle" not found in the configuration',
      );
    });
  });

  describe('all', function () {
    it('returns all feature toggles', async function () {
      // given
      const featureToggles = new FeatureTogglesClient(storage);
      await featureToggles.init(config);

      // when
      const all = await featureToggles.all();

      // then
      expect(all).to.deep.equal({ myToggle1: false, myToggle2: true, myToggle3: 'foo' });
    });
  });

  describe('withTag', function () {
    it('returns all feature toggles with the specified tag', async function () {
      // given
      const featureToggles = new FeatureTogglesClient(storage);
      await featureToggles.init(config);

      // when
      const withTags = await featureToggles.withTag('tag1');

      // then
      expect(withTags).to.deep.equal({ myToggle1: false });
    });
  });

  describe('resetDefaults', function () {
    it('resets all feature toggles to their default values', async function () {
      // given
      const featureToggles = new FeatureTogglesClient(storage);
      await featureToggles.init(config);
      await featureToggles.set('myToggle1', true);

      // when
      await featureToggles.resetDefaults();
      const all = await featureToggles.all();

      // then
      expect(all).to.deep.equal({ myToggle1: false, myToggle2: true, myToggle3: 'foo' });
    });
  });
});
