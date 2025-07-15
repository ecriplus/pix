import Route from '@ember/routing/route';

export default class LLMPreviewRoute extends Route {
  model(params) {
    return {
      chatId: params.chat_id,
    };
  }
}
