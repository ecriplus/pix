import PixBreadcrumb from "@1024pix/pix-ui/components/pix-breadcrumb";
import PixButtonLink from "@1024pix/pix-ui/components/pix-button-link";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { and } from "ember-truth-helpers";
import { t } from "ember-intl";

export default class Header extends Component {
  @service intl;
  @service currentUser;
  @service router;

  get isNotCLEA() {
    return this.args.complementaryCertification?.key !== 'CLEA';
  }

  get links() {
    return [
      {
        route: 'authenticated.certification-frameworks',
        label: this.intl.t('components.layout.sidebar.certification-frameworks'),
      },
      {
        label:
          this.args.complementaryCertification?.label || this.intl.t('components.certification-frameworks.labels.CORE'),
      },
    ];
  }

  <template>
    <header>
      <PixBreadcrumb @links={{this.links}} class="breadcrumb" />
    </header>

    <div class="certification-framework-header">
      <h1 class="certification-framework-header__title">
        <span>
          {{#if @complementaryCertification}}
            {{@complementaryCertification.label}}
          {{else}}
            {{t "components.certification-frameworks.labels.CORE"}}
          {{/if}}
        </span>
      </h1>

      {{#if (and this.currentUser.adminMember.isSuperAdmin this.isNotCLEA)}}
        <PixButtonLink
          class="framework__creation-button"
          @route="authenticated.certification-frameworks.item.framework.new-version"
          @size="large"
          @iconBefore="add"
        >
          {{t "components.complementary-certifications.item.framework.create-button"}}
        </PixButtonLink>
      {{/if}}
    </div>
  </template>
}
