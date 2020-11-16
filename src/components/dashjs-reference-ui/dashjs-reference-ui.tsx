import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'dashjs-reference-ui',
  styleUrl: 'dashjs-reference-ui.css',
  shadow: true,
})
export class DashjsReferenceUi {
  render() {
    return (
      <Host>
        <slot>Reference ui</slot>
      </Host>
    );
  }
}
