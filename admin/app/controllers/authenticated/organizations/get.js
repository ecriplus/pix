import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class GetController extends Controller {
  @service accessControl;
}
