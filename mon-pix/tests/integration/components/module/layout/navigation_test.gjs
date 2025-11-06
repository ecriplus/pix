import { render } from '@1024pix/ember-testing-library';
import { triggerKeyEvent } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import ModulixNavigation from 'mon-pix/components/module/layout/navigation';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | Navigation', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('when current section is second section', function () {
    test('should set aria-current attribute to the second NavigationButton element', async function (assert) {
      // given
      const modulixNavigationProgressService = this.owner.lookup('service:modulix-navigation-progress');
      modulixNavigationProgressService.setCurrentSectionIndex(1);
      const sections = [
        {
          type: 'question-yourself',
        },
        {
          type: 'explore-to-understand',
        },
        {
          type: 'retain-the-essentials',
        },
        {
          type: 'practise',
        },
        {
          type: 'go-further',
        },
      ];

      // when
      const screen = await render(<template><ModulixNavigation @sections={{sections}} /></template>);

      // then
      assert
        .dom(
          screen.getByRole('button', {
            name: `${t('pages.modulix.navigation.buttons.aria-label.steps', {
              indexSection: 2,
              totalSections: 5,
            })} ${t('pages.modulix.navigation.buttons.aria-label.enabled', {
              sectionTitle: 'Explorer pour comprendre',
            })}`,
          }),
        )
        .hasAria('current', 'true');
      assert
        .dom(
          screen.getByRole('button', {
            name: `${t('pages.modulix.navigation.buttons.aria-label.steps', {
              indexSection: 1,
              totalSections: 5,
            })} ${t('pages.modulix.navigation.buttons.aria-label.enabled', {
              sectionTitle: 'Se questionner',
            })}`,
          }),
        )
        .hasAria('current', 'false');
    });
  });

  module('handleArrowKeyNavigation', function () {
    module('when user press arrow down or right on buttons', function () {
      test('should focus on next button', async function (assert) {
        // given
        const sections = [
          {
            type: 'question-yourself',
          },
          {
            type: 'explore-to-understand',
          },
          {
            type: 'retain-the-essentials',
          },
        ];

        // when
        const screen = await render(<template><ModulixNavigation @sections={{sections}} /></template>);
        const button = screen.getByRole('button', {
          name: `${t('pages.modulix.navigation.buttons.aria-label.steps', {
            indexSection: 1,
            totalSections: 3,
          })} ${t('pages.modulix.navigation.buttons.aria-label.enabled', {
            sectionTitle: 'Se questionner',
          })}`,
        });
        button.focus();
        await triggerKeyEvent(button, 'keydown', 40);

        // then
        assert
          .dom(
            screen.getByRole('button', {
              name: `${t('pages.modulix.navigation.buttons.aria-label.steps', {
                indexSection: 2,
                totalSections: 3,
              })} ${t('pages.modulix.navigation.buttons.aria-label.disabled')}`,
            }),
          )
          .isFocused();
      });
    });

    module('when user press arrow up or left on buttons', function () {
      test('should focus on next button', async function (assert) {
        // given
        const sections = [
          {
            type: 'question-yourself',
          },
          {
            type: 'explore-to-understand',
          },
          {
            type: 'retain-the-essentials',
          },
        ];

        // when
        const screen = await render(<template><ModulixNavigation @sections={{sections}} /></template>);
        const button = screen.getByRole('button', {
          name: `${t('pages.modulix.navigation.buttons.aria-label.steps', {
            indexSection: 2,
            totalSections: 3,
          })} ${t('pages.modulix.navigation.buttons.aria-label.disabled')}`,
        });
        button.focus();
        await triggerKeyEvent(button, 'keydown', 38);

        // then
        assert
          .dom(
            screen.getByRole('button', {
              name: `${t('pages.modulix.navigation.buttons.aria-label.steps', {
                indexSection: 1,
                totalSections: 3,
              })} ${t('pages.modulix.navigation.buttons.aria-label.enabled', {
                sectionTitle: 'Se questionner',
              })}`,
            }),
          )
          .isFocused();
      });
    });
  });
});
