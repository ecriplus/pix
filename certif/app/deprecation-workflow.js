import setupDeprecationWorkflow from 'ember-cli-deprecation-workflow';

setupDeprecationWorkflow();

window.deprecationWorkflow = self.deprecationWorkflow || {};

window.deprecationWorkflow.config = {
  workflow: [],
};
