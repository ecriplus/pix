import Location from 'pix-certif/utils/location';

export function initialize(/* applicationInstance */) {
  const { pathname } = new URL(Location.getHref());

  const isJoinRoute = !!pathname.match(/^\/rejoindre/);

  if (isJoinRoute) {
    window.localStorage.removeItem('ember_simple_auth-session');
  }
}

export default {
  initialize,
};
