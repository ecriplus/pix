# CSS Classes

## Naming conventions

Favour the [BEM Block__Element--Modifier Convention](http://getbem.com/) as much as possible.

When re-using an element to turn it into a block, there is no need to keep the parent element name.

For example, with the parent `profilv2-header__hexagon-score`, the child should become `hexagon-score__content`. There is no need to call it `profilv2-header-hexagon-score__content`.

According to BEM, classes must not reflect the DOM tree structure, and should be as flat as possible. Because by definition of a block, everything of the form block__element-n is an indivisible whole.

## Creating CSS classes

CSS classes can be created in the `.hbs` or in the `.js`, depending on the need.

### In the `.js`

> When the CSS class does not need any special properties, it is sufficient to declare it in the `.js`.

```javascript
export default Component.extend({
  classNames: ['hexagon-score'], // which will add this class to the div created by Ember to inject the component
});
```

```html
<div class="hexagon-score__content">
  <div class="hexagon-score-content__title">PIX</div>
  <div class="hexagon-score-content__pix-score">{{score}}</div>
  <div class="hexagon-score-content__pix-total">1024</div>
</div>
```
At the `html` structure level, the div will appear as follows:
```html
<div class="ember-view" id="ember123">
  <div class="hexagon-score__content">
    <div class="hexagon-score-content__title">PIX</div>
    <div class="hexagon-score-content__pix-score">{{score}}</div>
    <div class="hexagon-score-content__pix-total">1024</div>
  </div>
</div>
```

### In the `.hbs`

> When the CSS class needs special properties, it is sufficient to declare it in the `.hbs`. At the `html` structure level, the structure will be identical to the `.hbs`.

```javascript
export default Component.extend({
  // component stuff
});
```
```html
<div class="hexagon-score">
  <div class="hexagon-score__content">
    <div class="hexagon-score-content__title">PIX</div>
    <div class="hexagon-score-content__pix-score">{{score}}</div>
    <div class="hexagon-score-content__pix-total">1024</div>
  </div>
</div>
```

## Responsibilities

In the pursuit of CSS class reusability, __ideally__:
* The block carries the __style__.
* The element carries the __positioning__.
* The modifier **minimally** alters some style descriptions of the block.
* A major modification signals the __need to create a new class__ / a new CSS "object".

These "_rules_" will not necessarily apply to unique components.

### Russian dolls nesting

Favour the creation of child classes that are __visually smaller__ than their parent class, like Russian dolls.

### Grouping generics

Gather colours in a single `.scss` file (`palette.scss` or `colors.scss`)

### Separation of concerns

Separate style from positioning. You can use `@mixin` for instance.
The idea is to at least easily decouple style from positioning so that the style can potentially be reused elsewhere. Even if it is preferable, this does not necessarily mean separating the classes at processing time.

```scss
// BAD
.hexagon-score-content__pix-score {
  position: absolute;
  width: 100%;
  top: 40px;
  color: $black;
  font-family: $font-open-sans;
  font-size: 4.6rem;
}

// GOOD
@mixin hexagon-score-pix-score {
  color: $black;
  font-family: $font-open-sans;
  font-size: 4.6rem;
}

.hexagon-score-content__pix-score {
  @include hexagon-score-pix-score;
  position: absolute;
  width: 100%;
  top: 40px;
}

```
