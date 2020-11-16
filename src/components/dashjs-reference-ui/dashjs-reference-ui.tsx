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
        <dashjs-player></dashjs-player>
        <duet-input label="Your name" placeholder="John Doe"></duet-input>
        <slot>Reference ui</slot>
      </Host>
    );
  }
}
