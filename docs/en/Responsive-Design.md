# Responsive Design

## Sizing

Width must be either __100%__ or a fixed __maximum width__ defined in px.
```scss
// BAD
.my-class {
  width: 70%;
}

// GOOD 
.my-class {
  width: 100%;
}

// ALSO GOOD 
.my-class {
  max-width: 1200px;
}
```

## Positioning

Avoid negative margin, padding, etc. values as much as possible and favour absolute positions.

```scss
// BAD
.my-class {
  display: flex;
  margin-top: -9875654px;
}

// GOOD
.my-class {
  position: absolute;
  top: 20px;
  left: 5px;
  right: 24132px;
  bottom: 12345px;
}
```

###### Pros

> More robust CSS, meaning how well my CSS produces the expected design when the CSS around it changes.

###### Cons

> Lower readability since with absolute position, the parent must be in relative position, etc.
> More classes are modified than needed.
