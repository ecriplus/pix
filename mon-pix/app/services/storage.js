import Service from '@ember/service';

const SESSIONSTORAGE_LOGIN = 'PIX_LOGIN';

export default class Storage extends Service {
  setLogin(login) {
    sessionStorage.setItem(SESSIONSTORAGE_LOGIN, login);
  }

  getLogin() {
    return sessionStorage.getItem(SESSIONSTORAGE_LOGIN);
  }

  clear() {
    return sessionStorage.clear();
  }
}
