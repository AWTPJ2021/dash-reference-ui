import { Component, Host, h, Element, State, Prop, Watch } from '@stencil/core';
import { MediaPlayer } from 'dashjs';

@Component({
  tag: 'dashjs-player',
  styleUrl: 'dashjs-player.css',
  shadow: true,
})
export class DashjsPlayer {
  @Element() private element: HTMLElement;

  @Prop() streamUrl: string;
  @State() currentUrl = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';

  componentDidLoad() {
    console.log(this.element);
    let url = this.currentUrl;
    let player = MediaPlayer().create();
    player.initialize(this.element.shadowRoot.querySelector('#myMainVideoPlayer'), url, true);
  }

  componentWillLoad() {
    this.onUrlChange(this.streamUrl);
  }

  @Watch('streamUrl')
  onUrlChange(newUrl: string) {
    if (newUrl) this.currentUrl = JSON.parse(newUrl);
  }

  render() {
    return (
      <Host>
        <slot>
          <div class="player-wrapper">
            <video controls={true} width="1920" id="myMainVideoPlayer"></video>
          </div>
        </slot>
      </Host>
    );
  }
}
