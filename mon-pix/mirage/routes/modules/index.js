import getModule from './get-module';
import getOldModule from './get-old-module';

export default function index(config) {
  config.get('/modules/v2/:shortId', getModule);
  config.get('/modules/:slug', getOldModule);
}
