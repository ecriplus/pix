import Controller from '@ember/controller';

export default class LLMPreviewController extends Controller {
  get iframeSrc() {
    const url = new URL('https://epreuves.pix.fr/pix-llm/pix-llm.html');
    url.searchParams.set('chatId', this.model.chatId);
    return url.href;
  }
}
