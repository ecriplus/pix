import Route from '@ember/routing/route';

export default class NewOrEditSnippetRoute extends Route {
  model() {
    console.log('coucou dans hook model NewOrEditSnippetRoute');
    return true;
  }
}
