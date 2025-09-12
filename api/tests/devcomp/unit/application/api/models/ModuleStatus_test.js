import { ModuleStatus } from '../../../../../../src/devcomp/application/api/models/ModuleStatus.js';
import { expect } from '../../../../../test-helper.js';

describe('Unit | Devcomp | Application | Api | Models | ModuleStatus', function () {
  it('should init and keep attributes', function () {
    // given
    const id = '4016621a-8777-46c6-876b-ab39f2c737c2';
    const slug = 'bien-ecrire-son-adresse-mail';
    const title = 'Bien écrire une adresse mail';
    const duration = 10;
    const status = 'NOT_STARTED';
    const image = 'emile';

    // when
    const moduleStatus = new ModuleStatus({
      id,
      slug,
      status,
      title,
      duration,
      image,
    });

    // then
    expect(moduleStatus.id).to.equal(id);
    expect(moduleStatus.slug).to.deep.equal(slug);
    expect(moduleStatus.status).to.equal(status);
    expect(moduleStatus.title).to.equal(title);
    expect(moduleStatus.duration).to.equal(duration);
    expect(moduleStatus.image).to.equal(image);
  });
});
