export function disableAnimation(win) {
  const injectedStyleEl = win.document.getElementById('__cy_disable_motion__');
  if (injectedStyleEl) {
    return;
  }
  win.document.head.insertAdjacentHTML(
    'beforeend',
    `
    <style id="__cy_disable_motion__">
      /* Disable CSS animations. */
      *, *::before, *::after { -webkit-animation: none !important; -moz-animation: none !important; -o-animation: none !important; -ms-animation: none !important; animation: none !important; }
    </style>
  `.trim()
  );
}
