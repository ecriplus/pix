import PixBreadcrumb from '@1024pix/pix-ui/components/pix-breadcrumb';
import PixButton from '@1024pix/pix-ui/components/pix-button';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import formatDate from 'ember-intl/helpers/format-date';
import { pageTitle } from 'ember-page-title';
import { DescriptionList } from 'pix-admin/components/ui/description-list';

import RequirementTag from '../common/combined-courses/requirement-tag';
import SafeMarkdownToHtml from '../safe-markdown-to-html';

export default class Details extends Component {
  @service intl;

  <template>
    {{pageTitle "Profil " @model.id " | Pix Admin" replace=true}}
    <header class="page-header">
      <PixBreadcrumb @links={{this.links}} />
    </header>

    <main class="page-body">
      <section class="page-section">
        <div class="combined-course-blueprint__container">

          <DescriptionList>

            <DescriptionList.Divider />

            <DescriptionList.Item @label={{t "components.combined-course-blueprints.labels.itemId"}}>
              {{@model.id}}
            </DescriptionList.Item>

            <DescriptionList.Divider />

            <DescriptionList.Item @label={{t "components.combined-course-blueprints.labels.internal-name"}}>
              {{@model.internalName}}
            </DescriptionList.Item>

            <DescriptionList.Item @label={{t "components.combined-course-blueprints.labels.name"}}>
              {{@model.name}}
            </DescriptionList.Item>

            <DescriptionList.Divider />

            <DescriptionList.Item @label={{t "components.combined-course-blueprints.labels.created-at"}}>
              {{formatDate @model.createdAt}}
            </DescriptionList.Item>

            {{#if @model.description}}
              <DescriptionList.Divider />

              <DescriptionList.Item @label={{t "components.combined-course-blueprints.labels.description"}}>
                <SafeMarkdownToHtml @markdown={{@model.description}} />
              </DescriptionList.Item>
            {{/if}}

            {{#if @model.illustration}}
              <DescriptionList.Divider />
              <DescriptionList.Item @label={{t "components.combined-course-blueprints.labels.illustration"}}>
                <img src={{@model.illustration}} alt="" />
              </DescriptionList.Item>
              <DescriptionList.Divider />
            {{/if}}

            <div class="combined-course-blueprint__content">
              <DescriptionList.Item>
                {{#each @model.content as |requirement|}}
                  <RequirementTag
                    @type={{requirement.type}}
                    @value={{requirement.value}}
                    @label={{requirement.value}}
                  />
                {{/each}}
              </DescriptionList.Item>
              <DescriptionList.Divider />
            </div>

          </DescriptionList>

          {{#if @model.illustration}}
            <div class="target-profile-section__image">
              <img src={{@model.illustration}} alt="" />
            </div>
          {{/if}}

        </div>
        <div class="target-profile__actions">

          <PixButton @triggerAction={{this.downloadCSV}} @size="small" @variant="success">
            Télécharger le schéma (CSV)
          </PixButton>

        </div>
      </section>
    </main>
  </template>

  get links() {
    return [
      {
        route: 'authenticated.combined-course-blueprints.list',
        label: this.intl.t('components.combined-course-blueprints.list.title'),
      },
      {
        label: this.args.model.internalName,
      },
    ];
  }
}
