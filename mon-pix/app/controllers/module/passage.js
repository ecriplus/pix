import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class Module extends Controller {
  queryParams = ['grainIndex'];

  @tracked grainIndex;
}
