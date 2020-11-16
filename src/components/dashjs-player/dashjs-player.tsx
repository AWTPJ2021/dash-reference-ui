import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'dashjs-player',
  styleUrl: 'dashjs-player.css',
  shadow: true,
})
export class DashjsPlayer {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
