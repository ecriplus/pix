export const DescriptionList = <template>
  <div class="description-list-container" ...attributes>
    <dl class="description-list">{{yield}}</dl>
  </div>
</template>;

DescriptionList.Item = <template>
  <dt class={{@labelClass}}>{{@label}}</dt>
  <dd class={{@valueClass}}>{{yield}}</dd>
</template>;

DescriptionList.ItemWithHTMLElement = <template>
  <dt class={{@labelClass}}>{{yield to="label"}}</dt>
  <dd class={{@valueClass}}>{{yield to="value"}}</dd>
</template>;
