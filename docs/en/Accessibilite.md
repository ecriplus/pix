# Accessibility

## Checking the accessibility of a site

Several (complementary) solutions:

- **Go to https://validator.w3.org/** (paste the URL of the site to test).

- **Install the browser extension "[Wave](https://wave.webaim.org/extension/)"**
    - Click on the extension icon to check for errors while browsing the site.

- **Install the browser extension "[Web Developer](https://addons.mozilla.org/en/firefox/addon/web-developer/)"** (preferably with Firefox)
    - Go to `Information > View Document Outline` to check the heading hierarchy:
      - It should match the order of importance of the page's information
      - Tag numbers must be sequential:
       `<h1><h2>` ✅
       `<h1><h3>` 🚨

- **Zoom in a lot (ctrl +)** and check whether elements overlap. The zoom must be a text zoom, available in Firefox (via the View menu > Zoom > Text zoom only).
    - If some text elements overflow (overlapping text, text that escapes a button), you will probably need to avoid fixed heights;
    - For text, pixels are to be avoided! Prefer relative units (rem, ...).
Note that using relative units for margins, height, etc. does not always work.

- **Remove graphic elements** and check whether information is preserved (e.g. by disabling CSS or even JS on a site). In Firefox: `View menu / Page style / No style`


## Tag semantics

Pay attention to the semantics (the meaning, the significance) of tags! This is very important in particular for screen readers used by blind people. Example:
- `<button>` = an action within the site itself
- `<a>` = a link, a redirect to another page or another site

### Using <h*> tags

Regardless of the appearance of the h* elements, sighted users who see the headings will understand. On the other hand, people who navigate with the keyboard using __voiceOver__ need the HTML to be as explicit as possible so that their tool can read it correctly.

Concretely, it is not bad practice to have a visually smaller/less contrasted h1 than an h2, etc. For example, an advertisement might be marked with the h1 heading "Advertisement", but visually it will be very small. What matters is to maintain a __cascading HTML structure__ for voiceOver (and web indexing).

**At least one h1 is required on each page**: it will be the page title. Example for the service-public homepage: "service-public individuals: know your rights make your requests". It is important to include the name of the overall site for context.
Moreover, this h1 must **contain the same thing as the page title**.

You can put an image inside a heading (example: _image with `alt="Pix"`_ Sign in)

### Using <div> tags

Ideally `div` tags are only used for decorative elements. Everything else must have a specific tag.

### More information

See the [w3c website for the list of tags](https://www.w3schools.com/TAGS/default.ASP).


## When should an image have an alt attribute?
You must **ALWAYS** put an alt on an `<img>` tag.

Note however that the alt should be empty if the image is "decorative" (meaning it can be removed without losing information, for example a background image). To decide whether an image is useful, ask yourself: "**if we remove the image, are we missing any information?**"

For other images, acting as buttons or links, etc., the alt content is essential. For example, preferred formulations would be:
- "Back to the Pix homepage" rather than "Pix logo", to explain what the button with the Pix logo image in the footer does.
- "Follow us on Facebook" rather than "Link to our Facebook page" (because the "link" information is already contained in the tag itself).
- "Supported by the Ministry of ..." rather than "Ministry of ... logo"

## CSS units

For texts, pixels are to be avoided! Relative units must be preferred.
Use __rem__ for fonts: size, lettering, letter-spaces.
Use __px__ for positioning: padding, border, margin.

```scss
.my-class {
  size: 1.3rem;
  padding: 10px 12px;
}
```

## Navigation
Normally every page is accessible via:
- Search bar
- Navigation bar
- Site map

EXCEPT checkout funnels, etc.

## Charts
- Check colour contrast
- Confusing colours must not be placed side by side (this can be tested by converting the screen to black and white)
- Use thick borders/outlines
- Legend outside the chart and complete (no ellipsis: ...)
- No display on hover
- Prefer a chart construction with a textual alternative:
    - a table containing the expanded data in an accordion below the chart
    - data in a `table`, visually transformed into a chart: screen readers will be able to read a table correctly
