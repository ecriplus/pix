export const DescriptionList = <template>
  <dl class="description-list" ...attributes>{{yield}}</dl>
</template>;

DescriptionList.Item = <template>
  <div ...attributes>
    <dt class={{@labelClass}}>{{@label}}</dt>
    <dd class={{@valueClass}}>{{yield}}</dd>
  </div>
</template>;

DescriptionList.ItemWithHTMLElement = <template>
  <div ...attributes>
    <dt class={{@labelClass}}>{{yield to="label"}}</dt>
    <dd class={{@valueClass}}>{{yield to="value"}}</dd>
  </div>
</template>;

DescriptionList.Divider = <template><div class="description-list__divider" /></template>;
