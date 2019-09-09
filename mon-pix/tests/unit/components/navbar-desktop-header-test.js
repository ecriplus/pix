import Service from '@ember/service';
import { expect } from 'chai';
import { beforeEach, describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit | Component | Navbar Desktop Header Component', function() {
  setupTest();
  const sessionStubResolve = Service.create({ isAuthenticated: true });
  const sessionStubReject = Service.create({ isAuthenticated: false });

  let component;

  describe('When user is logged', function() {
    beforeEach(function() {
      component = this.owner.lookup('component:navbar-desktop-header');
      component.set('session', sessionStubResolve);
    });

    context('#isUserLogged', function() {
      it('should return true', function() {
        // then
        expect(component.get('isUserLogged')).to.equal(true);
      });
    });

    context('#menu', function() {
      it('should only contains permanent menu items', function() {
        // given
        const expectedLoggedUserMenu = [];

        // then
        expect(component.get('menu')).to.deep.equal(expectedLoggedUserMenu);
      });
    });
  });

  describe('When user is not logged', function() {
    beforeEach(function() {
      component = this.owner.lookup('component:navbar-desktop-header');
      component.set('session', sessionStubReject);
    });

    context('#isUserLogged', function() {
      it('should return false, when user is unauthenticated', function() {
        // then
        expect(component.get('isUserLogged')).to.equal(false);
      });
    });

    context('#menu', function() {
      it('should set with default values (including connexion link)', function() {
        // given
        const expectedUnloggedUserMenu = [
          { name: 'Se connecter', link: 'login', class: 'navbar-menu-signin-link' },
          { name: 'S’inscrire', link: 'inscription', class: 'navbar-menu-signup-link' }
        ];

        // then
        expect(component.get('menu')).to.deep.equal(expectedUnloggedUserMenu);
      });
    });
  });
});
