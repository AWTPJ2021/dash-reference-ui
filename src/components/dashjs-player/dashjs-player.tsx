import { Component, Host, h, Element } from '@stencil/core';
import { MediaPlayer } from 'dashjs';

@Component({
  tag: 'dashjs-player',
  styleUrl: 'dashjs-player.css',
  shadow: true,
})
export class DashjsPlayer {
  @Element() private element: HTMLElement;

  connectedCallback() {}

  componentDidLoad() {
    console.log(this.element);
    let url = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';
    let player = MediaPlayer().create();
    player.initialize(this.element.shadowRoot.querySelector('#myMainVideoPlayer'), url, true);
  }

  render() {
    return (
      <Host>
        <slot>
          <video controls={true} width="400" height="200" id="myMainVideoPlayer"></video>
        </slot>
      </Host>
    );
  }
}
