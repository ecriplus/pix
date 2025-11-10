import ApplicationSerializer from './application';

const _includes = ['areas', 'badges', 'stageCollection'];

export default ApplicationSerializer.extend({
  include: _includes,
});
