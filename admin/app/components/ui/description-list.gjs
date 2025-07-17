export const DescriptionList = <template>
  <dl class="description-list" ...attributes>{{yield}}</dl>
</template>;

DescriptionList.Item = <template>
  <div ...attributes>
    <dt class={{@labelClass}}>{{@label}}</dt>
    <dd class={{@valueClass}}>{{yield}}</dd>
  </div>
</template>;

DescriptionList.Divider = <template><div class="description-list__divider" /></template>;
