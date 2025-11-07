import Controller from '@ember/controller';

export default class UtmQueryParamsController extends Controller {
  queryParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
}
