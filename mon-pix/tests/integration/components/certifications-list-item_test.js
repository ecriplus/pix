import { module, test } from 'qunit';
import { click, find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';
import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';

module('Integration | Component | certifications list item', function (hooks) {
  setupIntlRenderingTest(hooks);

  const PUBLISH_CLASS = '.certifications-list-item__published-item';
  const UNPUBLISH_CLASS = '.certifications-list-item__unpublished-item';
  const CERTIFICATION_CELL_SELECTOR = '.certifications-list-item__cell';
  const STATUS_SELECTOR = '.certifications-list-item__cell-double-width';
  const IMG_FOR_STATUS_SELECTOR = 'img[data-test-id="certifications-list-item__cross-img"]';
  const IMG_FOR_WAITING_STATUS_SELECTOR = 'img[data-test-id="certifications-list-item__hourglass-img"]';
  const PIX_SCORE_CELL_SELECTOR = '.certifications-list-item__pix-score';
  const DETAIL_SELECTOR = '.certifications-list-item__cell-detail';
  const REJECTED_DETAIL_SELECTOR = `${DETAIL_SELECTOR} button`;
  const VALIDATED_DETAIL_SELECTOR = `${DETAIL_SELECTOR} a`;
  const COMMENT_CELL_SELECTOR = '.certifications-list-item__row-comment-cell';
  const NOT_CLICKABLE_SELECTOR = '.certifications-list-item__not-clickable';
  const CLICKABLE_SELECTOR = '.certifications-list-item__clickable';

  const commentForCandidate = 'Commentaire pour le candidat';

  test('renders', async function (assert) {
    await render(hbs`<CertificationsListItem />`);
    assert.dom(find('.certifications-list-item__row-presentation')).exists();
  });

  module('when the certification is not published', function (hooks) {
    hooks.beforeEach(async function () {
      // given
      const certification = createCertification({
        status: 'validated',
        isPublished: false,
        commentForCandidate: null,
      });
      this.set('certification', certification);

      // when
      await render(hbs`<CertificationsListItem @certification={{this.certification}}/>`);
    });

    // then
    test('should render a certifications-list-item__unpublished-item div', function (assert) {
      assert.dom(find(UNPUBLISH_CLASS)).exists();
    });

    test('should show en attente de résultat', function (assert) {
      assert.dom(find(IMG_FOR_WAITING_STATUS_SELECTOR)).exists();
      assert.equal(find(STATUS_SELECTOR).textContent.trim(), 'En attente du résultat');
    });

    test('should not be clickable', function (assert) {
      assert.dom(find(NOT_CLICKABLE_SELECTOR)).exists();
      assert.dom(find(CLICKABLE_SELECTOR)).doesNotExist();
    });
  });

  module('when the certification is published and rejected', function () {
    module('without commentForCandidate', function (hooks) {
      hooks.beforeEach(async function () {
        // given
        const certification = createCertification({
          status: 'rejected',
          isPublished: true,
          commentForCandidate: null,
        });

        this.set('certification', certification);

        // when
        await render(hbs`<CertificationsListItem @certification={{this.certification}}/>`);
      });

      // then
      test('should render a certifications-list-item__published-item div', function (assert) {
        assert.dom(find(PUBLISH_CLASS)).exists();
      });

      test('should show Certification non obtenue', function (assert) {
        assert.dom(find(IMG_FOR_STATUS_SELECTOR)).exists();
        assert.equal(find(STATUS_SELECTOR).textContent.trim(), 'Certification non obtenue');
      });

      test('should not show Détail in last column', function (assert) {
        assert.dom(find(REJECTED_DETAIL_SELECTOR)).doesNotExist();
      });

      test('should not show comment for candidate panel when clicked on row', async function (assert) {
        // when
        await click(CERTIFICATION_CELL_SELECTOR);

        // then
        assert.dom(find(COMMENT_CELL_SELECTOR)).doesNotExist();
      });

      test('should not be clickable', function (assert) {
        assert.dom(find(NOT_CLICKABLE_SELECTOR)).exists();
        assert.dom(find(CLICKABLE_SELECTOR)).doesNotExist();
      });
    });

    module('with a commentForCandidate', function (hooks) {
      hooks.beforeEach(async function () {
        // given
        const certification = createCertification({
          status: 'rejected',
          isPublished: true,
          commentForCandidate,
        });
        this.set('certification', certification);

        // when
        await render(hbs`<CertificationsListItem @certification={{this.certification}}/>`);
      });

      // then
      test('should render a certifications-list-item__published-item div', function (assert) {
        assert.dom(find(PUBLISH_CLASS)).exists();
      });

      test('should show Certification non obtenue', function (assert) {
        assert.dom(find(IMG_FOR_STATUS_SELECTOR)).exists();
        assert.equal(find(STATUS_SELECTOR).textContent.trim(), 'Certification non obtenue');
      });

      test('should show Détail in last column', function (assert) {
        assert.dom(find(REJECTED_DETAIL_SELECTOR)).exists();
        assert.equal(find(REJECTED_DETAIL_SELECTOR).textContent.trim(), 'détail');
      });

      test('should show comment for candidate panel when clicked on row', async function (assert) {
        await click(CERTIFICATION_CELL_SELECTOR);

        assert.dom(find(COMMENT_CELL_SELECTOR)).exists();
        assert.equal(find(COMMENT_CELL_SELECTOR).textContent.trim(), commentForCandidate);
      });

      test('should be clickable', function (assert) {
        assert.dom(find(CLICKABLE_SELECTOR)).exists();
        assert.dom(find(NOT_CLICKABLE_SELECTOR)).doesNotExist();
      });
    });
  });

  module('when the certification is published and validated', function (hooks) {
    hooks.beforeEach(async function () {
      // given
      const certification = createCertification({
        status: 'validated',
        isPublished: true,
      });
      this.set('certification', certification);

      // when
      await render(hbs`<CertificationsListItem @certification={{this.certification}}/>`);
    });

    // then
    test('should render certifications-list-item__published-item with a link inside', function (assert) {
      assert.dom(find(`${PUBLISH_CLASS} a`)).exists();
    });

    test('should show Certification obtenue', function (assert) {
      assert.dom(find('img[data-test-id="certifications-list-item__green-check-img"]')).exists();
      assert.equal(find(STATUS_SELECTOR).textContent.trim(), 'Certification obtenue');
    });

    test('should show the Pix Score', function (assert) {
      assert.dom(find(PIX_SCORE_CELL_SELECTOR)).exists();
      assert.equal(find(PIX_SCORE_CELL_SELECTOR).textContent.trim(), '231');
    });

    test('should show link to certification page in last column', function (assert) {
      assert.dom(find(VALIDATED_DETAIL_SELECTOR)).exists();
      console.log(find(VALIDATED_DETAIL_SELECTOR).textContent.trim());
      assert.dom(find(VALIDATED_DETAIL_SELECTOR).textContent.trim().endsWith('résultats'));
    });

    test('should be clickable', function (assert) {
      assert.dom(find(CLICKABLE_SELECTOR)).exists();
      assert.dom(find(NOT_CLICKABLE_SELECTOR)).doesNotExist();
    });
  });

  module('when the certification is cancelled', function () {
    module('and is published', function () {
      module('and and has no comments', function () {
        test('should show Certification annulée without comments', async function (assert) {
          // given
          const certification = createCertification({
            status: 'cancelled',
            isPublished: true,
          });
          this.set('certification', certification);

          // when
          await render(hbs`<CertificationsListItem @certification={{this.certification}}/>`);

          assert.dom(find(PUBLISH_CLASS)).exists();
          assert.dom(find(IMG_FOR_STATUS_SELECTOR)).exists();
          assert.equal(find(STATUS_SELECTOR).textContent.trim(), 'Certification annulée');

          assert.dom(find('button')).doesNotExist();
        });

        test('should not be clickable', async function (assert) {
          // given
          const certification = createCertification({
            status: 'cancelled',
            isPublished: true,
          });
          this.set('certification', certification);

          // when
          await render(hbs`<CertificationsListItem @certification={{this.certification}}/>`);

          assert.dom(find(NOT_CLICKABLE_SELECTOR)).exists();
          assert.dom(find(CLICKABLE_SELECTOR)).doesNotExist();
        });
      });

      module('and and has comments', function () {
        test('should show Certification annulée with comments', async function (assert) {
          // given
          const certification = EmberObject.create({
            id: 1,
            date: '2018-02-15T15:15:52.504Z',
            status: 'cancelled',
            certificationCenter: 'Université de Paris',
            isPublished: true,
            commentForCandidate: 'random',
          });

          this.set('certification', certification);

          // when
          await render(hbs`<CertificationsListItem @certification={{this.certification}}/>`);

          assert.dom(find('button')).exists();
        });
      });

      test('should be clickable', async function (assert) {
        // given
        const certification = createCertification({
          status: 'cancelled',
          isPublished: true,
          commentForCandidate,
        });
        this.set('certification', certification);

        // when
        await render(hbs`<CertificationsListItem @certification={{this.certification}}/>`);

        assert.dom(find(CLICKABLE_SELECTOR)).exists();
        assert.dom(find(NOT_CLICKABLE_SELECTOR)).doesNotExist();
      });
    });

    module('and is not published', function (hooks) {
      hooks.beforeEach(async function () {
        // given
        const certification = createCertification({
          status: 'cancelled',
          isPublished: false,
        });
        this.set('certification', certification);

        // when
        await render(hbs`<CertificationsListItem @certification={{this.certification}}/>`);
      });

      // then
      test('should render a certifications-list-item__unpublished-item div', function (assert) {
        assert.dom(find(UNPUBLISH_CLASS)).exists();
      });

      test('should not show Certification annulée', function (assert) {
        assert.dom(find(IMG_FOR_STATUS_SELECTOR)).doesNotExist();
      });
    });
  });
});

function createCertification({ status, isPublished, commentForCandidate }) {
  return EmberObject.create({
    id: 1,
    date: '2018-02-15T15:15:52.504Z',
    certificationCenter: 'Université de Paris',
    pixScore: 231,
    status,
    isPublished,
    commentForCandidate,
  });
}
