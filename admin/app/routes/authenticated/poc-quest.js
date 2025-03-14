import Route from '@ember/routing/route';

export default class PocQuestRoute extends Route {
  model() {
    console.log('coucou dans hook model PocQuestRoute');
    return true;
  }
}
